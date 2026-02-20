import * as Yup from 'yup';

const userSchema = Yup.object({
  registeredAt: Yup.string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional()
    .default(null),
  tenantId: Yup.string().default(''),
  ownerName: Yup.string().required('wajib diisi').default(''),
  businessName: Yup.string().required('wajib diisi').default(''),
  businessType: Yup.string().required('wajib diisi').default(''),
  legalStatus: Yup.string().required('wajib diisi').default(''),
  operatingSince: Yup.string().required('wajib diisi').default(''),
  image: Yup.string().default(''),
  description: Yup.string().default(''),
  phone: Yup.string()
    .required('wajib diisi')
    .matches(/^\d+$/, 'Nomor hanya boleh berisi angka')
    .min(10, 'Minimal 10 digit')
    .max(15, 'Maksimal 15 digit'),
  email: Yup.string().required('wajib diisi').default(''),
  address: Yup.string().default(''),
  province: Yup.string().default(''),
  city: Yup.string().default(''),
  district: Yup.string().default(''),
  subdistrict: Yup.string().default(''),
  zipCode: Yup.string().default(''),
});

export default userSchema;
