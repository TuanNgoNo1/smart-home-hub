import { Navigation } from "@/components/shared/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  FileText, 
  BookOpen, 
  Github, 
  User, 
  GraduationCap, 
  IdCard,
  Key,
  ExternalLink,
  Cpu,
  Database,
  Globe,
  Server,
  Radio
} from "lucide-react";

const Profile = () => {
  // Personal Information
  const profileData = {
    name: "Nguyễn Văn A",
    className: "CNTT-K20",
    studentId: "B20DCCN001",
    avatarUrl: "", // Add your avatar URL here
  };

  // Important Links
  const links = {
    reportPdf: "https://example.com/report.pdf",
    apiDocs: "https://example.com/swagger",
    gitRepo: "https://github.com/username/iot-project",
  };

  // Tech Stack
  const techStack = {
    hardware: ["ESP32", "DHT22", "BH1750"],
    protocol: ["MQTT", "HiveMQ Broker"],
    backend: ["Spring Boot", "Java 17"],
    frontend: ["React", "TypeScript", "Tailwind CSS"],
    database: ["MySQL"],
  };

  // Demo Credentials
  const demoCredentials = {
    username: "demo@example.com",
    password: "demo123",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Header Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
                  <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                    {profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Personal Info */}
                <div className="text-center md:text-left space-y-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    {profileData.name}
                  </h1>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-medium">{profileData.className}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                      <IdCard className="w-4 h-4" />
                      <span className="font-medium">{profileData.studentId}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm max-w-md">
                    Đồ án IoT - Hệ thống giám sát và điều khiển thiết bị thông minh
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ExternalLink className="w-5 h-5 text-primary" />
                Liên kết quan trọng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* PDF Report */}
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary transition-all group"
                  asChild
                >
                  <a href={links.reportPdf} target="_blank" rel="noopener noreferrer">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="font-medium text-foreground">Báo cáo PDF</span>
                    <span className="text-xs text-muted-foreground">Xem tài liệu</span>
                  </a>
                </Button>

                {/* API Documentation */}
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary transition-all group"
                  asChild
                >
                  <a href={links.apiDocs} target="_blank" rel="noopener noreferrer">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="font-medium text-foreground">API Docs</span>
                    <span className="text-xs text-muted-foreground">Swagger UI</span>
                  </a>
                </Button>

                {/* Git Repository */}
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary transition-all group"
                  asChild
                >
                  <a href={links.gitRepo} target="_blank" rel="noopener noreferrer">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Github className="w-6 h-6 text-gray-700" />
                    </div>
                    <span className="font-medium text-foreground">Source Code</span>
                    <span className="text-xs text-muted-foreground">GitHub Repository</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="w-5 h-5 text-primary" />
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hardware */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Cpu className="w-4 h-4" />
                  Hardware
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.hardware.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Protocol */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Radio className="w-4 h-4" />
                  Protocol
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.protocol.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Server className="w-4 h-4" />
                  Backend
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.backend.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Frontend */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  Frontend
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.frontend.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Database */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Database className="w-4 h-4" />
                  Database
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.database.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="w-5 h-5 text-primary" />
                Demo Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-20">Username:</span>
                  <code className="bg-background px-2 py-1 rounded text-sm font-mono">
                    {demoCredentials.username}
                  </code>
                </div>
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-20">Password:</span>
                  <code className="bg-background px-2 py-1 rounded text-sm font-mono">
                    {demoCredentials.password}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                  * Sử dụng thông tin trên để đăng nhập vào hệ thống demo
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default Profile;
