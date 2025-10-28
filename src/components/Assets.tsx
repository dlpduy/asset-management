import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, UserPlus, UserMinus, ClipboardCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { AssetFormDialog } from './AssetFormDialog';
import { AssetDetailDialog } from './AssetDetailDialog';
import { AssignAssetDialog } from './AssignAssetDialog';
import { EvaluateAssetDialog } from './EvaluateAssetDialog';
import { 
  mockAssets, 
  mockAssetTypes, 
  mockDepartments, 
  mockUsers
} from '../lib/mockData';
import { Asset, UserRole, AssetStatus } from '../types';
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export function Assets() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [evaluateDialogOpen, setEvaluateDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Filter assets based on user role
  let filteredAssets = !currentUser ? [] :
    currentUser.role === UserRole.ADMIN
    ? mockAssets
    : currentUser.role === UserRole.MANAGER
    ? mockAssets.filter(a => a.departmentId === currentUser.departmentId)
    : mockAssets.filter(a => a.assignedTo === currentUser.id);

  // Apply filters
  if (searchTerm) {
    filteredAssets = filteredAssets.filter(
      asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedDepartment !== 'all') {
    filteredAssets = filteredAssets.filter(a => a.departmentId === selectedDepartment);
  }

  if (selectedStatus !== 'all') {
    filteredAssets = filteredAssets.filter(a => a.status === selectedStatus);
  }

  if (selectedType !== 'all') {
    filteredAssets = filteredAssets.filter(a => a.typeId === selectedType);
  }

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailDialogOpen(true);
  };

  const handleAssign = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssignDialogOpen(true);
  };

  const handleEvaluate = (asset: Asset) => {
    setSelectedAsset(asset);
    setEvaluateDialogOpen(true);
  };

  const canManageAssets = currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Quản lý Tài sản</h1>
          <p className="text-gray-600">Danh sách và quản lý tài sản</p>
        </div>
        {canManageAssets && (
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Thêm tài sản mới
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên, mã tài sản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {currentUser && currentUser.role === UserRole.ADMIN && (
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {mockDepartments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value={AssetStatus.IN_STOCK}>Trong kho</SelectItem>
                <SelectItem value={AssetStatus.IN_USE}>Đang sử dụng</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Loại tài sản" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {mockAssetTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã tài sản</TableHead>
                <TableHead>Tên tài sản</TableHead>
                <TableHead>Loại</TableHead>
                {currentUser.role === UserRole.ADMIN && <TableHead>Phòng ban</TableHead>}
                <TableHead>Người sử dụng</TableHead>
                <TableHead>Ngày mua</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Không tìm thấy tài sản nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => {
                  const assetType = mockAssetTypes.find(t => t.id === asset.typeId);
                  const department = mockDepartments.find(d => d.id === asset.departmentId);
                  const assignedUser = mockUsers.find(u => u.id === asset.assignedTo);

                  return (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.code}</TableCell>
                      <TableCell className="text-gray-900">{asset.name}</TableCell>
                      <TableCell>{assetType?.name}</TableCell>
                      {currentUser.role === UserRole.ADMIN && (
                        <TableCell>{department?.name || '-'}</TableCell>
                      )}
                      <TableCell>{assignedUser?.name || '-'}</TableCell>
                      <TableCell>{formatDate(asset.purchaseDate)}</TableCell>
                      <TableCell>{formatCurrency(asset.value)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(asset.status)}>
                          {getStatusLabel(asset.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(asset)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canManageAssets && (
                            <>
                              {asset.status === AssetStatus.IN_STOCK && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleAssign(asset)}
                                  title="Gán tài sản"
                                >
                                  <UserPlus className="w-4 h-4" />
                                </Button>
                              )}
                              {asset.status === AssetStatus.IN_USE && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEvaluate(asset)}
                                    title="Đánh giá"
                                  >
                                    <ClipboardCheck className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {/* Handle reclaim */}}
                                    title="Thu hồi"
                                  >
                                    <UserMinus className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AssetFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      {selectedAsset && (
        <>
          <AssetDetailDialog
            asset={selectedAsset}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
          />
          <AssignAssetDialog
            asset={selectedAsset}
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
          />
          <EvaluateAssetDialog
            asset={selectedAsset}
            open={evaluateDialogOpen}
            onOpenChange={setEvaluateDialogOpen}
          />
        </>
      )}
    </div>
  );
}
