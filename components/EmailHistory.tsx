'use client'

import { useState, useEffect } from 'react'
import { 
  EyeIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface EmailCampaign {
  id: number
  name: string
  template_id: number
  template_name: string
  list_name: string
  subject: string
  total_sent: number
  success_count: number
  error_count: number
  created_at: string
}

export default function EmailHistory() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Cargar historial
  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/email-history')
      const result = await response.json()
      
      if (result.success) {
        setCampaigns(result.data)
      } else {
        toast.error('Error al cargar historial')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  // Eliminar campaña
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta campaña del historial?')) return

    try {
      const response = await fetch(`/api/email-history?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Campaña eliminada del historial')
        loadHistory()
      } else {
        toast.error('Error al eliminar campaña')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  // Exportar a CSV
  const handleExportCSV = () => {
    const filteredCampaigns = getFilteredCampaigns()
    
    if (filteredCampaigns && Array.isArray(filteredCampaigns) && filteredCampaigns.length === 0) {
      toast.error('No hay datos para exportar')
      return
    }

    const headers = [
      'ID',
      'Nombre',
      'Plantilla',
      'Lista',
      'Asunto',
      'Total Enviados',
      'Exitosos',
      'Fallidos',
      'Tasa de Éxito',
      'Fecha'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredCampaigns.map(campaign => [
        campaign.id,
        `"${campaign.name}"`,
        `"${campaign.template_name || 'Sin plantilla'}"`,
        `"${campaign.list_name || 'Todas'}"`,
        `"${campaign.subject}"`,
        campaign.total_sent,
        campaign.success_count,
        campaign.error_count,
        `${((campaign.success_count / campaign.total_sent) * 100).toFixed(1)}%`,
        new Date(campaign.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `historial_emails_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('CSV exportado correctamente')
  }

  // Filtrar campañas
  const getFilteredCampaigns = () => {
    return campaigns.filter(campaign => {
      const matchesSearch = 
        (campaign.name && campaign.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (campaign.subject && campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (campaign.template_name && campaign.template_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (campaign.list_name && campaign.list_name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || getCampaignStatus(campaign) === statusFilter

      const matchesDate = dateFilter === 'all' || matchesDateFilter(campaign.created_at, dateFilter)

      return matchesSearch && matchesStatus && matchesDate
    })
  }

  // Obtener estado de la campaña
  const getCampaignStatus = (campaign: EmailCampaign) => {
    if (campaign.error_count === campaign.total_sent) return 'failed'
    if (campaign.success_count === campaign.total_sent) return 'sent'
    if (campaign.success_count > 0) return 'partial'
    return 'draft'
  }

  // Verificar filtro de fecha
  const matchesDateFilter = (dateString: string, filter: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    switch (filter) {
      case 'today':
        return date >= today
      case 'yesterday':
        return date >= yesterday && date < today
      case 'lastWeek':
        return date >= lastWeek
      case 'lastMonth':
        return date >= lastMonth
      default:
        return true
    }
  }

  // Obtener badge de estado
  const getStatusBadge = (campaign: EmailCampaign) => {
    const status = getCampaignStatus(campaign)
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Borrador', icon: CheckCircleIcon },
      partial: { color: 'bg-warning-100 text-warning-800', text: 'Parcial', icon: ExclamationTriangleIcon },
      sent: { color: 'bg-success-100 text-success-800', text: 'Completado', icon: CheckCircleIcon },
      failed: { color: 'bg-danger-100 text-danger-800', text: 'Fallido', icon: XCircleIcon }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    )
  }

  // Obtener estadísticas
  const getStats = () => {
    const filtered = getFilteredCampaigns()
    const totalCampaigns = filtered && Array.isArray(filtered) ? filtered.length : 0
    const totalSent = filtered.reduce((sum, c) => sum + c.total_sent, 0)
    const totalSuccess = filtered.reduce((sum, c) => sum + c.success_count, 0)
    const totalErrors = filtered.reduce((sum, c) => sum + c.error_count, 0)
    const successRate = totalSent > 0 ? ((totalSuccess / totalSent) * 100).toFixed(1) : '0'

    return { totalCampaigns, totalSent, totalSuccess, totalErrors, successRate }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const filteredCampaigns = getFilteredCampaigns()
  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Emails</h1>
          <p className="text-gray-600">Revisa el historial completo de tus campañas de email</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-secondary"
        >
          <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
          Exportar CSV
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <DocumentTextIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</div>
          <div className="text-sm text-gray-600">Total Campañas</div>
        </div>
        
        <div className="card text-center">
          <PaperAirplaneIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalSent}</div>
          <div className="text-sm text-gray-600">Total Enviados</div>
        </div>
        
        <div className="card text-center">
          <CheckCircleIcon className="w-8 h-8 text-success-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalSuccess}</div>
          <div className="text-sm text-gray-600">Exitosos</div>
        </div>
        
        <div className="card text-center">
          <EyeIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.successRate}%</div>
          <div className="text-sm text-gray-600">Tasa de Éxito</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar campañas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="partial">Parcial</option>
              <option value="sent">Completado</option>
              <option value="failed">Fallido</option>
            </select>
          </div>
          
          <div className="relative">
            <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="yesterday">Ayer</option>
              <option value="lastWeek">Última semana</option>
              <option value="lastMonth">Último mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de campañas */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaña
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plantilla
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resultados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.subject}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {campaign.template_name || 'Sin plantilla'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {campaign.list_name || 'Todas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(campaign)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">{campaign.success_count}</span>
                      <span className="text-gray-400">/</span>
                      <span>{campaign.total_sent}</span>
                      {campaign.error_count > 0 && (
                        <>
                          <span className="text-gray-400">/</span>
                          <span className="text-red-600">{campaign.error_count}</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {((campaign.success_count / campaign.total_sent) * 100).toFixed(1)}% éxito
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar del historial"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCampaigns && Array.isArray(filteredCampaigns) && filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'No se encontraron campañas con los filtros aplicados'
                : 'No hay campañas en el historial'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
