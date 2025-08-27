'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Store, Mail, Lock } from 'lucide-react'
import { AdminLogoIcon } from '@/components/AdminLogoIcon/AdminLogoIcon'
import Link from 'next/link'
import { AdminPaths } from '@/lib/url'
import { useRouteTransition } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shopName: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const { startRouteTransition } = useRouteTransition()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      if (!formData.email || !formData.password || !formData.shopName) return
      setIsLoading(true)
      const res = await fetch(AdminPaths.api.login, {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.status == 201) {
        const redirectUrl = data.redirectUrl
        if (redirectUrl) {
          startRouteTransition(() => router.push(AdminPaths.root))
        }
      } else {
        setIsLoading(false)
      }
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary mb-4 shadow-elegant">
              <AdminLogoIcon size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Your Store</h1>
            <p className="text-muted-foreground">Start building your ecommerce empire today</p>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader className="space-y-1 text-center pb-4">
              <CardTitle className="text-xl">Join thousands of merchants</CardTitle>
              <CardDescription>Set up your online store in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Shop Name */}
                <div className="space-y-2">
                  <Label htmlFor="shopName" className="text-sm font-medium text-foreground">
                    Shop Name
                  </Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-4 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="shopName"
                      name="shopName"
                      type="text"
                      placeholder="Your Amazing Store"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-4 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-4 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  Create Your Store
                </Button>
              </form>

              {/* Terms */}
              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>

              {/* Sign In Link */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href={AdminPaths.login}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Register
