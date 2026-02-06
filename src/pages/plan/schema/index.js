import * as Yup from 'yup';

const planSchema = Yup.object({
  name: Yup.string().required('Nama plan wajib diisi'),

  price: Yup.object({
    yearly: Yup.number()
      .typeError('Harga tahunan harus berupa angka')
      .min(0, 'Harga tahunan tidak boleh negatif')
      .required('Harga tahunan wajib diisi'),

    monthly: Yup.number()
      .typeError('Harga bulanan harus berupa angka')
      .min(0, 'Harga bulanan tidak boleh negatif')
      .required('Harga bulanan wajib diisi'),
  }).required(),

  discount: Yup.object({
    yearly: Yup.number()
      .typeError('Diskon tahunan harus berupa angka')
      .min(0, 'Diskon tahunan tidak boleh negatif')
      .required('Diskon tahunan wajib diisi'),

    monthly: Yup.number()
      .typeError('Diskon bulanan harus berupa angka')
      .min(0, 'Diskon bulanan tidak boleh negatif')
      .required('Diskon bulanan wajib diisi'),
  }).required(),

  description: Yup.string().nullable(),

  isActive: Yup.boolean().required('Status aktif wajib diisi').default(true),

  modules: Yup.object({
    dashboard: Yup.boolean().default(false),
    pos: Yup.boolean().default(false),
    orders: Yup.boolean().default(false),
    pickup: Yup.boolean().default(false),
    scan_orders: Yup.boolean().default(false),
    sales_report: Yup.boolean().default(false),
    popular_product: Yup.boolean().default(false),
    payment_overview: Yup.boolean().default(false),
    category: Yup.boolean().default(false),
    subcategory: Yup.boolean().default(false),
    product: Yup.boolean().default(false),
    variant: Yup.boolean().default(false),
    promotion: Yup.boolean().default(false),
    user: Yup.boolean().default(false),
  }).required('Konfigurasi modul wajib diisi'),
});

export default planSchema;
