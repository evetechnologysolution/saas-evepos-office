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
});

export default planSchema;
