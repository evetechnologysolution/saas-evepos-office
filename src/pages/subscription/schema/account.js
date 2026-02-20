import * as Yup from 'yup';

const userSchema = Yup.object({
  status: Yup.string().default('active'),
  reason: Yup.string()
    .when('status', {
      is: 'suspended',
      then: (schema) => schema.required('Jika suspend alasan wajib diisi'),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(''),
});

export default userSchema;
