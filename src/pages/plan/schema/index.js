import * as Yup from 'yup';

const moduleSchema = Yup.object({
  enabled: Yup.boolean().default(false).required(),

  qty: Yup.number()
    .transform((value) => (Number.isNaN(value) ? 0 : value))
    .min(0, 'Qty tidak boleh negatif')
    .default(0)
    .when('enabled', {
      is: true,
      then: (schema) => schema.min(1, 'Qty wajib diisi jika module aktif'),
    }),
});

const dashboardModuleSchema = Yup.object({
  enabled: Yup.boolean().default(false).required(),
  qty: Yup.number().default(0),
});

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

  selectedCustomer: Yup.object({
    allCustomer: Yup.boolean().default(false),
    newCustomer: Yup.boolean().default(false),
    oldCustomer: Yup.boolean().default(false),
    autoRenewalCustomer: Yup.boolean().default(false),
  }),

  modules: Yup.object({
    dashboard: dashboardModuleSchema,
    dashboardB: dashboardModuleSchema,
    dashboardC: dashboardModuleSchema,
    dashboardD: dashboardModuleSchema,
    dashboardE: dashboardModuleSchema,

    pos: moduleSchema,
    orders: moduleSchema,
    pickup: moduleSchema,
    scan_orders: moduleSchema,

    sales_report: moduleSchema,
    popular_product: moduleSchema,
    payment_overview: moduleSchema,

    category: moduleSchema,
    subcategory: moduleSchema,
    product: moduleSchema,
    variant: moduleSchema,
    promotion: moduleSchema,

    user: moduleSchema,
  }).required('Konfigurasi modul wajib diisi'),
});

export default planSchema;
