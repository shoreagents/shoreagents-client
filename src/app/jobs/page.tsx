"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, SaveIcon, XIcon } from "lucide-react"

interface JobForm {
  title: string
  department: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string
}

export default function JobsPage() {
  const { user } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState<JobForm>({
    title: "",
    department: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: ""
  })

  const handleInputChange = (field: keyof JobForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Job form submitted:", formData)
    setIsFormOpen(false)
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "",
      salary: "",
      description: "",
      requirements: ""
    })
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "",
      salary: "",
      description: "",
      requirements: ""
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2 py-2 md:gap-3 md:py-3">
              <div className="flex flex-col gap-4 p-4">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Jobs</h1>
                    <p className="text-muted-foreground">
                      Manage job postings and recruitment
                    </p>
                  </div>
                  <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Add Job
                  </Button>
                </div>

                {/* Job Form */}
                {isFormOpen && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Job</CardTitle>
                      <CardDescription>
                        Create a new job posting for your organization
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                              id="title"
                              value={formData.title}
                              onChange={(e) => handleInputChange("title", e.target.value)}
                              placeholder="e.g., Senior Software Engineer"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="hr">Human Resources</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => handleInputChange("location", e.target.value)}
                              placeholder="e.g., New York, NY"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="type">Job Type</Label>
                            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="salary">Salary Range</Label>
                            <Input
                              id="salary"
                              value={formData.salary}
                              onChange={(e) => handleInputChange("salary", e.target.value)}
                              placeholder="e.g., $80,000 - $120,000"
                              required
                            />
                          </div>


                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Job Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                            rows={4}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="requirements">Requirements</Label>
                          <Textarea
                            id="requirements"
                            value={formData.requirements}
                            onChange={(e) => handleInputChange("requirements", e.target.value)}
                            placeholder="List the key requirements, skills, and qualifications needed..."
                            rows={3}
                            required
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <Button type="button" variant="outline" onClick={handleCancel}>
                            <XIcon className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button type="submit">
                            <SaveIcon className="h-4 w-4 mr-2" />
                            Save Job
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Jobs List Placeholder */}
                {!isFormOpen && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Jobs</CardTitle>
                      <CardDescription>
                        Manage your current job postings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          No jobs posted yet
                        </p>
                        <Button onClick={() => setIsFormOpen(true)} variant="outline">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create Your First Job
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 