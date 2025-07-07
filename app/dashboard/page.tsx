'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Plus, FileText, Calendar, User, LogOut, Edit, Trash2, Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface QuestionPaper {
  id: string
  title: string
  created_at: string
  updated_at: string
  header_info: {
    subject: string
    exam_name: string
  }
}

export default function DashboardPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
    fetchPapers()
  }, [])

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
  }

  const fetchPapers = async () => {
    try {
      const { data, error } = await supabase
        .from('question_papers')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setPapers(data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch question papers',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleDeletePaper = async (id: string) => {
    try {
      const { error } = await supabase
        .from('question_papers')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPapers(papers.filter(paper => paper.id !== id))
      toast({
        title: 'Success',
        description: 'Question paper deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete question paper',
        variant: 'destructive',
      })
    }
  }

  const handleDuplicatePaper = async (paper: QuestionPaper) => {
    try {
      const { data, error } = await supabase
        .from('question_papers')
        .insert([{
          ...paper,
          id: undefined,
          title: `${paper.title} (Copy)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error

      if (data) {
        setPapers([data[0], ...papers])
        toast({
          title: 'Success',
          description: 'Question paper duplicated successfully',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate question paper',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Question Paper Creator</h1>
                <p className="text-sm text-gray-500">Create professional question papers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Question Papers</h2>
            <p className="text-gray-600 mt-1">Manage and create your question papers</p>
          </div>
          <Button onClick={() => router.push('/create')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Paper
          </Button>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No question papers yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first question paper</p>
            <Button onClick={() => router.push('/create')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Paper
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{paper.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {paper.header_info?.subject && (
                          <Badge variant="secondary" className="mr-2">
                            {paper.header_info.subject}
                          </Badge>
                        )}
                        {paper.header_info?.exam_name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Updated {format(new Date(paper.updated_at), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/create/${paper.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicatePaper(paper)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePaper(paper.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}