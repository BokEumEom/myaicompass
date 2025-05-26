"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, User, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export function UserProfile() {
  const { user, profile } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [jobTitle, setJobTitle] = useState(profile?.job_title || "")
  const [autoGenerateReports, setAutoGenerateReports] = useState(profile?.auto_generate_reports !== false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "")
      setBio(profile.bio || "")
      setJobTitle(profile.job_title || "")
      setAutoGenerateReports(profile.auto_generate_reports !== false)
      setAvatarUrl(profile.avatar_url || "")
    }
  }, [profile])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        setError("이미지 크기는 2MB 이하여야 합니다.")
        return
      }
      setAvatarFile(file)
      // 미리보기 URL 생성
      const objectUrl = URL.createObjectURL(file)
      setAvatarUrl(objectUrl)
    }
  }

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null

    try {
      const fileExt = avatarFile.name.split(".").pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, avatarFile)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from("profiles").getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      console.error("Error uploading avatar:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      // 아바타 업로드 (있는 경우)
      let newAvatarUrl = avatarUrl
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar()
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl
        }
      }

      const { error } = await supabase
        .from("users")
        .update({
          display_name: displayName,
          bio,
          job_title: jobTitle,
          auto_generate_reports: autoGenerateReports,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch (err) {
      console.error("Profile update error:", err)
      setError("프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.")
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 정보</CardTitle>
        <CardDescription>개인 정보를 관리하고 업데이트하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>프로필이 성공적으로 업데이트되었습니다.</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="text-lg bg-teal-100 text-teal-800">
                {displayName ? getInitials(displayName) : <User />}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="avatar"
                className="cursor-pointer px-4 py-2 border rounded-md hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                프로필 이미지 변경
              </Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled className="bg-gray-50" />
            <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">이름</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">직업/직함</Label>
            <Input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="예: UX 디자이너, 마케팅 매니저, 프리랜서 작가"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">자기소개</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자신에 대한 간략한 소개를 작성해주세요."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoGenerateReports" className="block mb-1">
                  월간 보고서 자동 생성
                </Label>
                <p className="text-xs text-muted-foreground">매월 자동으로 AI 적응 보고서를 생성합니다.</p>
              </div>
              <Switch id="autoGenerateReports" checked={autoGenerateReports} onCheckedChange={setAutoGenerateReports} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "저장 중..." : "변경사항 저장"}
        </Button>
      </CardFooter>
    </Card>
  )
}
