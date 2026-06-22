import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { booksApi } from '../../../api/books'
import { uploadApi } from '../../../api/upload'
import { categoriesApi } from '../../../api/categories'
import { AdminNavbar } from '../../../components/AdminNavbar'
import { AdminBookDiscountsPage } from '../AdminBookDiscountsPage'
import { P } from '../../WorkflowPages.styles'
import {
  Container,
  Header,
  Title,
  FilterBar,
  SearchInput,
  TableContainer,
  AdminTable,
  Th,
  Td,
  ActionButton,
  FormGrid,
  FormCard,
  FormCardTitle,
  FormRow,
  FormGroup,
  FormLabel,
  FormInput,
  FormButton,
  ImageGallery,
  ImageThumbnailCard,
  GalleryImage,
  ThumbnailBadge,
  CheckboxWrapper,
  UploadDropzone,
  UploadIconWrap,
  UploadText,
  UploadSubtext,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  TabHeader,
  TabButton,
  CategoryTreeContainer,
  CategoryRow,
  CategoryInfo,
  CategoryActions,
  CategoryBadge,
  SubCategoryContainer
} from '../AdminWorkflowPages.styles'
import { Plus, BookOpen, Trash2, ArrowUp, Upload, Folder, Layers, Edit2, PlusCircle, Percent } from 'react-feather'

export function AdminAddBookPage() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()

  const [activeSubTab, setActiveSubTab] = useState('book-directory') // 'book-directory', 'book-form', 'categories-crud' or 'banners'
  const [editingBookId, setEditingBookId] = useState(null)

  // Book Form State
  const [form, setForm] = useState({
    title: '',
    author: '',
    selling_price: '',
    stock_quantity: '',
    code: '',
    edition: '1',
    publication_date: new Date().toISOString().split('T')[0],
    book_detail: {
      description: '',
      height: '',
      length: '',
      pages: '',
      publisher: '',
      supplier: '',
      weight: '',
      width: ''
    }
  })

  // Directory List Filter States
  const [dirPage, setDirPage] = useState(1)
  const [dirSearch, setDirSearch] = useState('')
  const [dirStatus, setDirStatus] = useState('ALL') // 'ALL', 'ACTIVE', 'DELETED'
  const [dirCategory, setDirCategory] = useState('')
  const [dirSort, setDirSort] = useState('id')
  const [dirOrder, setDirOrder] = useState('desc')

  // Local Category Checklist & General Category List State
  const [categoriesList, setCategoriesList] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])

  // Local Images Draft Queue State
  const [localImages, setLocalImages] = useState([])
  const [dragImageId, setDragImageId] = useState(null)

  // Image Input Draft State
  const [imageInputForm, setImageInputForm] = useState({
    image_url: '',
    sort_order: 0,
    is_primary: false,
    alt_text: ''
  })

  // Category CRUD Form State
  const [categoryForm, setCategoryForm] = useState({ name: '', parent_id: '' })
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  // Banners state (held in localStorage fallback as requested)
  const [bannersList, setBannersList] = useState([])
  const [bannerForm, setBannerForm] = useState({ title: '', link_url: '' })
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerFileUrl, setBannerFileUrl] = useState('')

  // Status indicators
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Format currency & dates
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  // Load categories list on mount
  async function loadCategories() {
    try {
      const res = await categoriesApi.list()
      setCategoriesList(res)
    } catch (err) {
      console.error('Không thể tải danh mục', err)
    }
  }

  const adminBooksQuery = useQuery({
    queryKey: ['admin-books-directory', {
      page: dirPage,
      q: dirSearch,
      status: dirStatus,
      category_id: dirCategory,
      sort: dirSort,
      order: dirOrder
    }],
    queryFn: () => booksApi.adminList({
      page: dirPage,
      size: 10,
      q: dirSearch.trim() || undefined,
      category_id: dirCategory ? Number(dirCategory) : undefined,
      sort: dirSort,
      order: dirOrder,
      include_deleted: true,
      status: dirStatus === 'ACTIVE' ? 'active' : dirStatus === 'DELETED' ? 'deleted' : undefined
    }),
    staleTime: 60_000,
  })

  const directoryBooks = adminBooksQuery.data?.data || []
  const dirTotalPages = adminBooksQuery.data?.page?.pages || 1
  const dirLoading = adminBooksQuery.isLoading

  // Reset Form attributes back to default
  function resetForm() {
    setForm({
      title: '',
      author: '',
      selling_price: '',
      stock_quantity: '',
      code: '',
      edition: '1',
      publication_date: new Date().toISOString().split('T')[0],
      book_detail: {
        description: '',
        height: '',
        length: '',
        pages: '',
        publisher: '',
        supplier: '',
        weight: '',
        width: ''
      }
    })
    setSelectedCategoryIds([])
    setLocalImages([])
    setEditingBookId(null)
    setError('')
    setMsg('')
  }

  // Soft Delete a book listing
  async function handleSoftDelete(bookId) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tạm thời sách này? Sách sẽ bị ẩn khỏi cửa hàng.')) return
    try {
      setLoading(true)
      await booksApi.remove(bookId)
      setMsg('Đã xóa sách thành công!')
      await queryClient.invalidateQueries({ queryKey: ['admin-books-directory'] })
    } catch (err) {
      setError(err.message || 'Xóa sách thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Restore a deleted book listing
  async function handleRestore(bookId) {
    try {
      setLoading(true)
      await booksApi.restore(bookId)
      setMsg('Đã khôi phục sách thành công!')
      await queryClient.invalidateQueries({ queryKey: ['admin-books-directory'] })
    } catch (err) {
      setError(err.message || 'Khôi phục thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Pre-fill book info & detail to edit
  async function startEditBook(book) {
    try {
      setLoading(true)
      setError('')
      setMsg('Đang tải thông tin chi tiết sách...')

      const detail = await booksApi.detail(book.id)

      setEditingBookId(book.id)
      setForm({
        title: detail.title || '',
        author: detail.author || '',
        selling_price: String(detail.selling_price || ''),
        stock_quantity: String(detail.stock_quantity || '0'),
        code: detail.code || '',
        edition: String(detail.edition || '1'),
        publication_date: detail.publication_date || new Date().toISOString().split('T')[0],
        book_detail: {
          description: detail.book_detail?.description || '',
          height: String(detail.book_detail?.height || ''),
          length: String(detail.book_detail?.length || ''),
          pages: String(detail.book_detail?.pages || ''),
          publisher: detail.book_detail?.publisher || '',
          supplier: detail.book_detail?.supplier || '',
          weight: String(detail.book_detail?.weight || ''),
          width: String(detail.book_detail?.width || '')
        }
      })

      const selectedCats = (detail.categories || []).map(c => c.id)
      setSelectedCategoryIds(selectedCats)

      const imgList = (detail.images || []).map(img => ({
        id: `cdn-${img.id}`,
        file: null,
        image_url: img.image_url,
        sort_order: img.sort_order,
        is_primary: img.is_primary,
        alt_text: img.alt_text || 'Product image'
      }))
      setLocalImages(imgList)

      setActiveSubTab('book-form')
      setMsg('Đã tải thông tin sách lên form chỉnh sửa!')
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin sách')
    } finally {
      setLoading(false)
    }
  }

  // Load lists on mounting
  useEffect(() => {
    loadCategories()
    const stored = localStorage.getItem('homepage_banners')
    if (stored) {
      try {
        setBannersList(JSON.parse(stored))
      } catch (err) {
        console.error(err)
      }
    }

    const tabParam = searchParams.get('tab')
    if (tabParam) {
      setActiveSubTab(tabParam)
    }

    const bookId = searchParams.get('id')
    if (bookId) {
      startEditBook({ id: Number(bookId) })
    }
  }, [searchParams])

  function saveBanners(newBanners) {
    setBannersList(newBanners)
    localStorage.setItem('homepage_banners', JSON.stringify(newBanners))
  }

  function handleAddBanner(file) {
    if (!file) {
      setError('Tệp tin hình ảnh banner là bắt buộc')
      return
    }

    setLoading(true)
    setError('')
    setMsg('Đang tải ảnh banner lên hệ thống CDN...')

    const token = localStorage.getItem('access_token')
    uploadApi.generalImage(file, token)
      .then((cdnResult) => {
        if (cdnResult?.url) {
          const newBanner = {
            id: `banner-${Date.now()}`,
            image_url: cdnResult.url,
            title: bannerForm.title.trim(),
            link_url: bannerForm.link_url.trim() || '/app/search'
          }
          const updated = [...bannersList, newBanner]
          saveBanners(updated)
          setBannerForm({ title: '', link_url: '' })
          setBannerFile(null)
          setBannerFileUrl('')
          setMsg('Đã đăng tải và thêm banner quảng cáo mới thành công!')
        } else {
          throw new Error('Không lấy được đường dẫn ảnh sau khi tải lên')
        }
      })
      .catch((err) => {
        setError(err.message || 'Lỗi tải ảnh lên CDN')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handleDeleteBanner(id) {
    if (!window.confirm('Bạn có chắc muốn xóa banner quảng cáo này?')) return
    const updated = bannersList.filter(b => b.id !== id)
    saveBanners(updated)
    setMsg('Đã xóa banner thành công!')
  }

  // Build recursive mapping tree helper
  const categoryTree = useMemo(() => {
    const map = {}
    const roots = []

    categoriesList.forEach(c => {
      map[c.id] = { ...c, children: [] }
    })

    categoriesList.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(map[c.id])
      } else if (!c.parent_id) {
        roots.push(map[c.id])
      }
    })
    return roots
  }, [categoriesList])

  // Category Selection Toggle Helper
  function toggleCategorySelection(catId) {
    setSelectedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    )
  }

  // Helper to pick main primary cover image url
  const pickPrimaryImage = (book) => {
    const images = Array.isArray(book?.images) ? book.images : []
    const primary = images.find((x) => x?.is_primary) || images[0]
    return primary?.image_url || book?.image_url || ''
  }

  // Handle image selector input locally (Reads using FileReader & pushes to draft queue)
  function handleLocalFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    const localUrl = URL.createObjectURL(file)
    const newLocalImg = {
      id: `local-${Date.now()}-${Math.random()}`,
      file: file,
      image_url: localUrl,
      sort_order: localImages.length,
      is_primary: localImages.length === 0, // Make primary if first image
      alt_text: file.name.split('.')[0]
    }

    setLocalImages(prev => [...prev, newLocalImg])
    setMsg('Đã thêm ảnh vào hàng chờ xuất bản!')
  }

  // Handle manual imageUrl entries locally
  function handleManualImageUrlAdd() {
    if (!imageInputForm.image_url.trim()) {
      setError('Please provide a valid image URL')
      return
    }
    setError('')
    const newLocalImg = {
      id: `manual-${Date.now()}-${Math.random()}`,
      file: null,
      image_url: imageInputForm.image_url,
      sort_order: Number(imageInputForm.sort_order || localImages.length),
      is_primary: Boolean(imageInputForm.is_primary) || localImages.length === 0,
      alt_text: imageInputForm.alt_text || 'Product image'
    }

    // If marked primary, uncheck others
    if (newLocalImg.is_primary) {
      setLocalImages(prev => prev.map(img => ({ ...img, is_primary: false })).concat(newLocalImg))
    } else {
      setLocalImages(prev => [...prev, newLocalImg])
    }

    setImageInputForm({ image_url: '', sort_order: 0, is_primary: false, alt_text: '' })
    setMsg('Custom Image link added to draft queue!')
  }

  // Set cover/primary local image draft
  function setPrimaryLocalImage(targetId) {
    setLocalImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === targetId
    })))
  }

  // Remove local image draft
  function removeLocalImage(targetId) {
    setLocalImages(prev => prev.filter(img => img.id !== targetId))
  }

  // Drag and drop sorting inside local image drafts
  function onDropLocalImage(targetImageId) {
    if (!dragImageId || !targetImageId || dragImageId === targetImageId) return
    const sourceIndex = localImages.findIndex(x => x.id === dragImageId)
    const targetIndex = localImages.findIndex(x => x.id === targetImageId)
    if (sourceIndex < 0 || targetIndex < 0) return

    const next = [...localImages]
    const [moved] = next.splice(sourceIndex, 1)
    next.splice(targetIndex, 0, moved)

    // Recalculate sort orders based on new index positions
    const sorted = next.map((img, idx) => ({ ...img, sort_order: idx }))
    setLocalImages(sorted)
    setDragImageId(null)
  }

  // Unified Save Book creation & modification workflow
  async function handleBookPublish() {
    if (!form.title.trim()) {
      setError('Tiêu đề sách là bắt buộc')
      return
    }
    if (!form.author.trim()) {
      setError('Tác giả là bắt buộc')
      return
    }
    if (!form.selling_price) {
      setError('Giá bán là bắt buộc')
      return
    }

    try {
      setLoading(true)
      setError('')
      const isEditing = editingBookId !== null

      setMsg(isEditing ? 'Đang thực hiện giao dịch cập nhật sách...' : 'Đang khởi tạo đăng ký sách mới...')

      // 1. Upload all local files sequentially to Cloudinary CDN
      const token = localStorage.getItem('access_token')
      const uploadedImages = []

      for (let i = 0; i < localImages.length; i++) {
        const item = localImages[i]

        let finalRemoteUrl = item.image_url
        if (item.file) {
          setMsg(`Đang tải lên ảnh sản phẩm ${i + 1}/${localImages.length}...`)
          const cdnResult = await uploadApi.generalImage(item.file, token)
          if (cdnResult?.url) {
            finalRemoteUrl = cdnResult.url
          } else {
            throw new Error(`Tải ảnh thất bại tại ảnh số ${i + 1}`)
          }
        }

        uploadedImages.push({
          id: item.id.startsWith('cdn-') ? Number(item.id.replace('cdn-', '')) : null,
          image_url: finalRemoteUrl,
          sort_order: i,
          is_primary: item.is_primary,
          alt_text: item.alt_text,
          isNew: !item.id.startsWith('cdn-')
        })
      }

      // 2. Format detailed physical metrics
      const bookDetailPayload = {
        description: form.book_detail.description || null,
        height: form.book_detail.height ? Number(form.book_detail.height) : null,
        length: form.book_detail.length ? Number(form.book_detail.length) : null,
        width: form.book_detail.width ? Number(form.book_detail.width) : null,
        weight: form.book_detail.weight ? Number(form.book_detail.weight) : null,
        pages: form.book_detail.pages ? Number(form.book_detail.pages) : null,
        publisher: form.book_detail.publisher || null,
        supplier: form.book_detail.supplier || null
      }

      const bookPayload = {
        title: form.title,
        author: form.author,
        selling_price: Number(form.selling_price),
        stock_quantity: Number(form.stock_quantity || 0),
        code: form.code || null,
        edition: form.edition ? Number(form.edition) : 1,
        publication_date: form.publication_date || null
      }

      let savedBookId = editingBookId

      if (isEditing) {
        setMsg('Đang cập nhật thông tin và thông số vật lý...')

        const currentDetail = await booksApi.detail(editingBookId)
        const detailId = currentDetail?.book_detail_id || currentDetail?.book_detail?.id

        if (detailId) {
          await booksApi.updateDetail(detailId, bookDetailPayload)
        }

        await booksApi.update(editingBookId, bookPayload)

        // Sync categories
        setMsg('Đang cập nhật liên kết danh mục...')
        await booksApi.categories.update(editingBookId, { category_ids: selectedCategoryIds })

        // Sync image links
        setMsg('Đang đồng bộ hóa hình ảnh sản phẩm...')
        const existingImages = currentDetail?.images || []

        // Remove deleted images
        const keptIds = uploadedImages.filter(x => !x.isNew).map(x => x.id)
        const toDelete = existingImages.filter(x => !keptIds.includes(x.id))

        for (const img of toDelete) {
          await booksApi.images.remove(editingBookId, img.id)
        }

        // Create new or update order
        for (const img of uploadedImages) {
          if (img.isNew) {
            await booksApi.images.create(editingBookId, {
              image_url: img.image_url,
              sort_order: img.sort_order,
              is_primary: img.is_primary,
              alt_text: img.alt_text
            })
          } else {
            await booksApi.images.update(editingBookId, img.id, {
              sort_order: img.sort_order,
              is_primary: img.is_primary,
              alt_text: img.alt_text
            })
          }
        }

        setMsg(`Thành công! Đã lưu thay đổi cho sách "${form.title}"!`)
      } else {
        setMsg('Đang lưu thông tin sách và thông số chi tiết vào cơ sở dữ liệu...')
        const bookCreatePayload = {
          ...bookPayload,
          book_detail: bookDetailPayload
        }

        const createdBook = await booksApi.create(bookCreatePayload)
        savedBookId = createdBook?.id || createdBook?.data?.id

        if (!savedBookId) {
          throw new Error('Đăng ký sách thất bại, không nhận được ID sách')
        }

        // Update and bind categories
        if (selectedCategoryIds.length > 0) {
          setMsg('Đang liên kết các danh mục đã chọn...')
          await booksApi.categories.update(savedBookId, { category_ids: selectedCategoryIds })
        }

        // Create backend book images links
        if (uploadedImages.length > 0) {
          setMsg('Đang liên kết ảnh sản phẩm vào cơ sở dữ liệu...')
          for (const img of uploadedImages) {
            await booksApi.images.create(savedBookId, {
              image_url: img.image_url,
              sort_order: img.sort_order,
              is_primary: img.is_primary,
              alt_text: img.alt_text
            })
          }
        }

        setMsg(`Thành công! Đã đăng bán sách "${form.title}" với ID #${savedBookId}!`)
      }

      // Clear form and reload directory
      resetForm()
      setActiveSubTab('book-directory')
      await queryClient.invalidateQueries({ queryKey: ['admin-books-directory'] })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Giao dịch đăng sách thất bại')
    } finally {
      setLoading(false)
    }
  }

  // CATEGORY CRUD HANDLERS
  async function submitCategoryForm(e) {
    e.preventDefault()
    if (!categoryForm.name.trim()) return
    try {
      setLoading(true)
      setError('')
      const payload = {
        name: categoryForm.name.trim(),
        parent_id: categoryForm.parent_id ? Number(categoryForm.parent_id) : null
      }
      if (editingCategoryId) {
        await categoriesApi.update(editingCategoryId, payload)
        setMsg('Cập nhật danh mục thành công!')
      } else {
        await categoriesApi.create(payload)
        setMsg('Tạo danh mục mới thành công!')
      }
      setCategoryForm({ name: '', parent_id: '' })
      setEditingCategoryId(null)
      await loadCategories()
    } catch (err) {
      setError(err.message || 'Thao tác danh mục thất bại')
    } finally {
      setLoading(false)
    }
  }

  function startEditCategory(cat) {
    setEditingCategoryId(cat.id)
    setCategoryForm({
      name: cat.name || '',
      parent_id: cat.parent_id ? String(cat.parent_id) : ''
    })
    setMsg('')
    setError('')
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này? (Các danh mục con sẽ mất liên kết cha)')) return
    try {
      setLoading(true)
      setError('')
      await categoriesApi.remove(id)
      setMsg('Xóa danh mục thành công!')
      await loadCategories()
    } catch (err) {
      setError(err.message || 'Xóa danh mục thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Recursive Category List Renderer helper
  function renderCategoryNodes(nodes) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {nodes.map(node => (
          <div key={node.id}>
            <CategoryRow>
              <CategoryInfo>
                <Folder size={16} style={{ color: '#8b5cf6' }} />
                <span>{node.name}</span>
                {node.parent_id && <CategoryBadge>Danh mục con</CategoryBadge>}
              </CategoryInfo>
              <CategoryActions>
                <ActionButton
                  style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#8b5cf6' }}
                  onClick={() => startEditCategory(node)}
                >
                  <Edit2 size={12} /> Sửa
                </ActionButton>
                <ActionButton
                  style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#ef4444' }}
                  onClick={() => handleDeleteCategory(node.id)}
                >
                  <Trash2 size={12} /> Xóa
                </ActionButton>
              </CategoryActions>
            </CategoryRow>
            {node.children && node.children.length > 0 && (
              <SubCategoryContainer>
                {renderCategoryNodes(node.children)}
              </SubCategoryContainer>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Recursive Category Checklist Selector for Book Creator
  function renderCategoryCheckboxes(nodes) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '4px' }}>
        {nodes.map(node => (
          <div key={node.id} style={{ marginLeft: node.parent_id ? '16px' : '0px' }}>
            <CheckboxWrapper>
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(node.id)}
                onChange={() => toggleCategorySelection(node.id)}
              />
              <span style={{ fontWeight: node.parent_id ? 500 : 700, fontSize: '13px' }}>
                {node.name}
              </span>
            </CheckboxWrapper>
            {node.children && node.children.length > 0 && (
              <div style={{ borderLeft: '1px dotted #cbd5e1', marginLeft: '6px', paddingLeft: '8px' }}>
                {renderCategoryCheckboxes(node.children)}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <Title>Quản lý Sách & Danh mục</Title>
        </Header>

        {/* Tab switch panel */}
        <TabHeader>
          <TabButton
            $active={activeSubTab === 'book-directory'}
            onClick={() => { setActiveSubTab('book-directory'); setMsg(''); setError(''); }}
          >
            <Layers size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Danh sách sách
          </TabButton>
          <TabButton
            $active={activeSubTab === 'book-form'}
            onClick={() => { setActiveSubTab('book-form'); setMsg(''); setError(''); }}
          >
            <BookOpen size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            {editingBookId ? 'Sửa thông tin sách' : 'Thêm sách mới'}
          </TabButton>
          <TabButton
            $active={activeSubTab === 'categories-crud'}
            onClick={() => { setActiveSubTab('categories-crud'); setMsg(''); setError(''); }}
          >
            <Folder size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Quản lý danh mục
          </TabButton>
          <TabButton
            $active={activeSubTab === 'book-discounts'}
            onClick={() => { setActiveSubTab('book-discounts'); setMsg(''); setError(''); }}
          >
            <Percent size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Quản lý giảm giá
          </TabButton>
          <TabButton
            $active={activeSubTab === 'banners'}
            onClick={() => { setActiveSubTab('banners'); setMsg(''); setError(''); }}
          >
            <PlusCircle size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Quản lý Banner
          </TabButton>
        </TabHeader>

        {/* Tab 1: Book Directory Table */}
        {activeSubTab === 'book-directory' && (
          <>
            <FilterBar style={{ marginBottom: '16px', marginTop: '8px' }}>
              <SearchInput
                type="text"
                placeholder="Tìm sách theo tiêu đề, tác giả hoặc SKU..."
                value={dirSearch}
                onChange={(e) => { setDirSearch(e.target.value); setDirPage(1); }}
              />

              <select
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
                value={dirStatus}
                onChange={(e) => { setDirStatus(e.target.value); setDirPage(1); }}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang bán</option>
                <option value="DELETED">Đã xóa tạm</option>
              </select>

              <select
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '180px'
                }}
                value={dirCategory}
                onChange={(e) => { setDirCategory(e.target.value); setDirPage(1); }}
              >
                <option value="">Tất cả danh mục</option>
                {categoriesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
                value={dirSort}
                onChange={(e) => { setDirSort(e.target.value); setDirPage(1); }}
              >
                <option value="id">Sắp xếp: ID</option>
                <option value="title">Sắp xếp: Tiêu đề</option>
                <option value="selling_price">Sắp xếp: Giá bán</option>
                <option value="stock_quantity">Sắp xếp: Tồn kho</option>
              </select>

              <select
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer'
                }}
                value={dirOrder}
                onChange={(e) => { setDirOrder(e.target.value); setDirPage(1); }}
              >
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>

              <ActionButton
                style={{ marginLeft: 'auto', backgroundColor: '#10b981' }}
                onClick={() => { resetForm(); setActiveSubTab('book-form'); }}
              >
                <Plus size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Thêm sách mới
              </ActionButton>
            </FilterBar>

            {msg && <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', margin: '8px 0' }}>{msg}</p>}
            {error && <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', margin: '8px 0' }}>{error}</p>}

            {dirLoading && <P>Đang tải danh sách sách...</P>}
            {!dirLoading && (
              <TableContainer>
                <AdminTable>
                  <thead>
                    <tr>
                      <Th style={{ width: '80px' }}>ID</Th>
                      <Th>Thông tin sách</Th>
                      <Th>Tác giả</Th>
                      <Th style={{ width: '150px' }}>Giá bán</Th>
                      <Th style={{ width: '100px' }}>Tồn kho</Th>
                      <Th style={{ width: '120px' }}>Trạng thái</Th>
                      <Th style={{ width: '220px', textAlign: 'right' }}>Thao tác</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {directoryBooks.length === 0 ? (
                      <tr>
                        <Td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                          Không tìm thấy sách nào.
                        </Td>
                      </tr>
                    ) : (
                      directoryBooks.map((book) => {
                        const primaryImg = pickPrimaryImage(book)
                        const isDeleted = book.deleted_at !== null
                        return (
                          <tr key={book.id} style={{ opacity: isDeleted ? 0.6 : 1 }}>
                            <Td style={{ fontWeight: 700 }}>#{book.id}</Td>
                            <Td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {primaryImg ? (
                                  <img
                                    src={primaryImg}
                                    alt={book.title}
                                    style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                  />
                                ) : (
                                  <div style={{ width: '40px', height: '56px', backgroundColor: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={16} style={{ color: '#94a3b8' }} />
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{book.title}</div>
                                  {book.code && (
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                      SKU: {book.code}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Td>
                            <Td style={{ fontWeight: 500 }}>{book.author}</Td>
                            <Td style={{ fontWeight: 700, color: '#1e293b' }}>
                              {formatCurrency(book.selling_price)}
                            </Td>
                            <Td style={{ fontWeight: 600 }}>
                              {book.stock_quantity || 0}
                            </Td>
                            <Td>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                borderRadius: '9999px',
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: isDeleted ? '#fee2e2' : '#dcfce7',
                                color: isDeleted ? '#991b1b' : '#166534'
                              }}>
                                {isDeleted ? 'Đã xóa tạm' : 'Đang bán'}
                              </span>
                            </Td>
                            <Td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <ActionButton
                                  style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6' }}
                                  onClick={() => startEditBook(book)}
                                >
                                  Sửa
                                </ActionButton>
                                {isDeleted ? (
                                  <ActionButton
                                    style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10b981' }}
                                    onClick={() => handleRestore(book.id)}
                                  >
                                    Khôi phục
                                  </ActionButton>
                                ) : (
                                  <ActionButton
                                    style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#ef4444' }}
                                    onClick={() => handleSoftDelete(book.id)}
                                  >
                                    Xóa
                                  </ActionButton>
                                )}
                              </div>
                            </Td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </AdminTable>

                {dirTotalPages > 1 && (
                  <PaginationContainer>
                    <PaginationInfo>Trang {dirPage} / {dirTotalPages}</PaginationInfo>
                    <PaginationControls>
                      <PaginationButton
                        disabled={dirPage === 1}
                        onClick={() => setDirPage(prev => prev - 1)}
                      >
                        Trước
                      </PaginationButton>
                      <PaginationButton
                        disabled={dirPage === dirTotalPages}
                        onClick={() => setDirPage(prev => prev + 1)}
                      >
                        Sau
                      </PaginationButton>
                    </PaginationControls>
                  </PaginationContainer>
                )}
              </TableContainer>
            )}
          </>
        )}

        {/* Tab 2: Book Registration & Editor Form */}
        {activeSubTab === 'book-form' && (
          <FormGrid>
            {/* Left Column - Specifications */}
            <FormCard>
              <FormCardTitle>
                <BookOpen size={20} />
                {editingBookId ? `Chỉnh sửa thông số sách: ID #${editingBookId}` : 'Register Detailed Book Attributes'}
              </FormCardTitle>

              {/* SECTION: BASIC INFO */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Identifiers</h4>
                <FormGroup>
                  <FormLabel>Book Title *</FormLabel>
                  <FormInput
                    placeholder="e.g. Harry Potter and the Philosopher's Stone"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </FormGroup>

                <FormRow style={{ marginTop: '12px' }}>
                  <FormGroup>
                    <FormLabel>Author *</FormLabel>
                    <FormInput
                      placeholder="e.g. J. K. Rowling"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Unique SKU Code</FormLabel>
                    <FormInput
                      placeholder="e.g. HP-001"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow style={{ marginTop: '12px' }}>
                  <FormGroup>
                    <FormLabel>Selling Price (VND) *</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 150000"
                      value={form.selling_price}
                      onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Initial Stock Quantity</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 50"
                      value={form.stock_quantity}
                      onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                    />
                  </FormGroup>
                </FormRow>
              </div>

              {/* SECTION: EDITION & DATES */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Edition & Dates</h4>
                <FormRow>
                  <FormGroup>
                    <FormLabel>Book Edition (No.)</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 1"
                      value={form.edition}
                      onChange={(e) => setForm({ ...form, edition: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Publication Date</FormLabel>
                    <FormInput
                      type="date"
                      value={form.publication_date}
                      onChange={(e) => setForm({ ...form, publication_date: e.target.value })}
                    />
                  </FormGroup>
                </FormRow>
              </div>

              {/* SECTION: DETAILED SPECIFICATIONS (Book Details) */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catalog & Publisher Details</h4>
                <FormRow>
                  <FormGroup>
                    <FormLabel>Publisher Name</FormLabel>
                    <FormInput
                      placeholder="e.g. Bloomsbury Publishing"
                      value={form.book_detail.publisher}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, publisher: e.target.value }
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormInput
                      placeholder="e.g. Fahasa Distributor"
                      value={form.book_detail.supplier}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, supplier: e.target.value }
                      })}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow style={{ marginTop: '12px' }}>
                  <FormGroup>
                    <FormLabel>Total Page Counts</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 320"
                      value={form.book_detail.pages}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, pages: e.target.value }
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Weight (g)</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="e.g. 350"
                      value={form.book_detail.weight}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, weight: e.target.value }
                      })}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow style={{ marginTop: '12px' }}>
                  <FormGroup>
                    <FormLabel>Width (cm)</FormLabel>
                    <FormInput
                      type="number"
                      step="0.1"
                      placeholder="e.g. 14.5"
                      value={form.book_detail.width}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, width: e.target.value }
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormInput
                      type="number"
                      step="0.1"
                      placeholder="e.g. 20.5"
                      value={form.book_detail.height}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, height: e.target.value }
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Thickness (cm)</FormLabel>
                    <FormInput
                      type="number"
                      step="0.1"
                      placeholder="e.g. 2.1"
                      value={form.book_detail.length}
                      onChange={(e) => setForm({
                        ...form,
                        book_detail: { ...form.book_detail, length: e.target.value }
                      })}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup style={{ marginTop: '12px' }}>
                  <FormLabel>Book Description</FormLabel>
                  <textarea
                    placeholder="Provide a comprehensive summary or overview..."
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      minHeight: '120px',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    value={form.book_detail.description}
                    onChange={(e) => setForm({
                      ...form,
                      book_detail: { ...form.book_detail, description: e.target.value }
                    })}
                  />
                </FormGroup>
              </div>

              {/* SECTION: ASSOCIATE HIERARCHICAL CATEGORIES */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Associate Categories</h4>
                <div style={{
                  maxHeight: '260px',
                  overflowY: 'auto',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: '#f8fafc'
                }}>
                  {categoryTree.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No categories registered. Please add categories in the management tab first.</p>
                  ) : (
                    renderCategoryCheckboxes(categoryTree)
                  )}
                </div>
              </div>

              {/* Feedback messages */}
              {msg && <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', margin: 0 }}>{msg}</p>}
              {error && <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', margin: 0 }}>{error}</p>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <FormButton
                  type="button"
                  onClick={handleBookPublish}
                  disabled={loading || !form.title || !form.author || !form.selling_price}
                >
                  {loading ? 'Executing Transaction...' : (editingBookId ? 'Save Book Changes' : 'Publish Book Entry')}
                </FormButton>

                <ActionButton
                  type="button"
                  style={{ backgroundColor: '#64748b' }}
                  onClick={() => { resetForm(); setActiveSubTab('book-directory'); }}
                >
                  Quay lại Directory
                </ActionButton>
              </div>
            </FormCard>

            {/* Right Column - Images local drafter */}
            <FormCard>
              <FormCardTitle>Đăng ký hình ảnh sản phẩm ({localImages.length})</FormCardTitle>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Hỗ trợ đăng tải các tệp hình ảnh từ thiết bị của bạn. Chỉ cho phép tệp ảnh thực tế, không chấp nhận nhập liên kết URL để đảm bảo tính khả dụng tối đa.
              </p>

              <FormGroup style={{ marginTop: '16px' }}>
                <FormLabel>Tải ảnh sản phẩm lên *</FormLabel>
                <label htmlFor="local-image-uploader">
                  <UploadDropzone>
                    <UploadIconWrap>
                      <Upload size={24} />
                    </UploadIconWrap>
                    <UploadText>Chọn tệp từ máy tính để tải lên</UploadText>
                    <UploadSubtext>Chấp nhận định dạng PNG, JPG, WEBP, v.v.</UploadSubtext>
                    <input
                      type="file"
                      id="local-image-uploader"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleLocalFileSelect}
                    />
                  </UploadDropzone>
                </label>
              </FormGroup>

              {/* Local Images List Display */}
              <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <FormLabel>Hàng chờ hình ảnh ({localImages.length})</FormLabel>
                {localImages.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0', textAlign: 'center' }}>
                    Chưa có tệp ảnh nào được xếp vào hàng chờ.
                  </p>
                ) : (
                  <ImageGallery>
                    {localImages.map((img) => (
                      <ImageThumbnailCard
                        key={img.id}
                        $isPrimary={img.is_primary}
                        draggable
                        onDragStart={() => setDragImageId(img.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDropLocalImage(img.id)}
                      >
                        {img.is_primary && <ThumbnailBadge>Ảnh bìa</ThumbnailBadge>}
                        <GalleryImage src={img.image_url} alt={img.alt_text} />
                        <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                          <ActionButton
                            style={{ padding: '4px', fontSize: '10px', flex: 1, backgroundColor: '#8b5cf6' }}
                            title="Đặt làm ảnh bìa chính"
                            onClick={() => setPrimaryLocalImage(img.id)}
                          >
                            <ArrowUp size={12} />
                          </ActionButton>
                          <ActionButton
                            style={{ padding: '4px', fontSize: '10px', backgroundColor: '#ef4444' }}
                            title="Gỡ ảnh"
                            onClick={() => removeLocalImage(img.id)}
                          >
                            <Trash2 size={12} />
                          </ActionButton>
                        </div>
                      </ImageThumbnailCard>
                    ))}
                  </ImageGallery>
                )}
              </div>
            </FormCard>
          </FormGrid>
        )}

        {/* Tab Content 3: Category CRUD Manager */}
        {activeSubTab === 'categories-crud' && (
          <FormGrid>
            {/* Left side: Category registration / modification */}
            <FormCard>
              <FormCardTitle>
                <Layers size={20} />
                {editingCategoryId ? 'Modify Category' : 'Register New Category'}
              </FormCardTitle>

              <form onSubmit={submitCategoryForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormGroup>
                  <FormLabel>Category Name *</FormLabel>
                  <FormInput
                    placeholder="e.g. Science Fiction"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Parent Category</FormLabel>
                  <select
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      color: '#1e293b',
                      cursor: 'pointer'
                    }}
                    value={categoryForm.parent_id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
                  >
                    <option value="">-- No Parent (Root Category) --</option>
                    {categoriesList
                      .filter(c => c.id !== editingCategoryId) // Prevent self parent loop
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </FormGroup>

                {msg && <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', margin: 0 }}>{msg}</p>}
                {error && <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', margin: 0 }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <FormButton type="submit" disabled={loading}>
                    {editingCategoryId ? 'Update Category' : 'Create Category'}
                  </FormButton>
                  {editingCategoryId && (
                    <ActionButton
                      type="button"
                      style={{ backgroundColor: '#64748b' }}
                      onClick={() => {
                        setEditingCategoryId(null)
                        setCategoryForm({ name: '', parent_id: '' })
                      }}
                    >
                      Cancel Edit
                    </ActionButton>
                  )}
                </div>
              </form>
            </FormCard>

            {/* Right side: Categories tree display hierarchy */}
            <FormCard>
              <FormCardTitle><Folder size={20} /> Categories Hierarchy Tree</FormCardTitle>
              {categoryTree.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                  No categories found. Start by registering a category on the left side!
                </p>
              ) : (
                <CategoryTreeContainer>
                  {renderCategoryNodes(categoryTree)}
                </CategoryTreeContainer>
              )}
            </FormCard>
          </FormGrid>
        )}

        {/* Tab Content 4: Banners Manager (LocalStorage dynamic slider) */}
        {activeSubTab === 'banners' && (
          <FormGrid>
            {/* Left side: Add Banner form */}
            <FormCard>
              <FormCardTitle>
                <PlusCircle size={20} />
                Thêm Banner mới
              </FormCardTitle>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
                Kích thước khuyên dùng: <strong>1200 x 400 pixels</strong> (tỷ lệ khung hình 3:1) để hiển thị đẹp mắt, tối ưu nhất trên mọi loại màn hình máy tính và thiết bị di động.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormGroup>
                  <FormLabel>Tiêu đề banner (Không bắt buộc)</FormLabel>
                  <FormInput
                    placeholder="Ví dụ: Hội Sách Hè 2026"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Tải ảnh banner lên *</FormLabel>
                  <label htmlFor="banner-image-uploader">
                    <UploadDropzone style={{ minHeight: '110px' }}>
                      <Upload size={20} />
                      <UploadText style={{ fontSize: '13px' }}>
                        {bannerFile ? bannerFile.name : 'Chọn tệp tin ảnh từ thiết bị'}
                      </UploadText>
                      <UploadSubtext style={{ fontSize: '11px' }}>Hỗ trợ PNG, JPG, WEBP</UploadSubtext>
                      <input
                        type="file"
                        id="banner-image-uploader"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setBannerFile(file)
                            setBannerFileUrl(URL.createObjectURL(file))
                            setError('')
                          }
                        }}
                      />
                    </UploadDropzone>
                  </label>
                  {bannerFileUrl && (
                    <img
                      src={bannerFileUrl}
                      alt="Banner Preview"
                      style={{
                        width: '100%',
                        height: '110px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        marginTop: '8px'
                      }}
                    />
                  )}
                </FormGroup>

                <FormGroup>
                  <FormLabel>Liên kết khi nhấn (URL điều hướng)</FormLabel>
                  <FormInput
                    placeholder="Ví dụ: /app/search hoặc /app/book/12"
                    value={bannerForm.link_url}
                    onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                  />
                </FormGroup>

                {msg && <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', margin: 0 }}>{msg}</p>}
                {error && <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', margin: 0 }}>{error}</p>}

                <FormButton
                  type="button"
                  onClick={() => handleAddBanner(bannerFile)}
                  disabled={loading || !bannerFile}
                >
                  Lưu Banner quảng cáo
                </FormButton>
              </div>
            </FormCard>

            {/* Right side: Active Banner lists */}
            <FormCard>
              <FormCardTitle>Danh sách Banner hoạt động ({bannersList.length})</FormCardTitle>
              {bannersList.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '32px' }}>
                  Chưa có banner quảng cáo nào được lưu. Hãy khởi tạo một banner ở cột bên trái!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '480px', overflowY: 'auto' }}>
                  {bannersList.map((banner) => (
                    <div key={banner.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
                      <img src={banner.image_url} alt={banner.title || 'Banner'} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>{banner.title || '(Không có tiêu đề)'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Link: {banner.link_url}</div>
                        </div>
                        <ActionButton
                          style={{ padding: '6px 10px', fontSize: '12px', backgroundColor: '#ef4444' }}
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 size={13} style={{ verticalAlign: 'middle' }} /> Xóa
                        </ActionButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FormCard>
          </FormGrid>
        )}

        {/* Tab Content 5: Book Discounts Tab */}
        {activeSubTab === 'book-discounts' && (
          <AdminBookDiscountsPage isSubTab={true} />
        )}
      </Container>
    </>
  )
}
