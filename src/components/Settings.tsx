import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Bell, MessageSquare, Moon } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Cài đặt</h1>
        <p className="text-gray-600">Quản lý cài đặt hệ thống</p>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <CardTitle>Thông báo</CardTitle>
            </div>
            <CardDescription>
              Cấu hình thông báo tự động
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo email</Label>
                <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Nhắc nhở đánh giá tài sản</Label>
                <p className="text-sm text-gray-500">Gửi nhắc nhở khi đến hạn đánh giá</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Số ngày nhắc trước</Label>
              <Input type="number" defaultValue="7" className="max-w-xs" />
              <p className="text-sm text-gray-500">
                Gửi thông báo nhắc nhở trước X ngày
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Chatbot Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <CardTitle>Chatbot AI</CardTitle>
            </div>
            <CardDescription>
              Cấu hình trợ lý AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Kích hoạt chatbot</Label>
                <p className="text-sm text-gray-500">Hiển thị chatbot cho người dùng</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Tự động gợi ý</Label>
                <p className="text-sm text-gray-500">Chatbot tự động gợi ý câu hỏi phổ biến</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              <CardTitle>Giao diện</CardTitle>
            </div>
            <CardDescription>
              Tùy chỉnh giao diện hiển thị
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Chế độ tối</Label>
                <p className="text-sm text-gray-500">Sử dụng giao diện tối</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Hiển thị sidebar</Label>
                <p className="text-sm text-gray-500">Luôn hiển thị thanh điều hướng</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-blue-600">
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </div>
  );
}
