import Joi from "joi";

class UserValidator {
  ObjectIdSchema = Joi.string()
    .hex()
    .length(24)
    .message("Object ID not valid")
    .required();

  PatientSchema = Joi.object().keys({
    fullName: Joi.string().min(3).max(100),
    dob: Joi.date(),
    gender: Joi.string().valid("male", "female", "other"),
    profilePhoto: Joi.string().allow(null, ""),
    phone: Joi.string(),
    address: Joi.string(),
    country: Joi.string(),
  });

  DoctorSchema = Joi.object().keys({
    fullName: Joi.string().min(3).max(100),
    dob: Joi.date(),
    gender: Joi.string().valid("male", "female", "other"),
    profilePhoto: Joi.string().allow(null, ""),
    phone: Joi.string(),
    about: Joi.string(),
    registered_office: Joi.string(),
    cost: Joi.number().integer().min(1),
    duration: Joi.number().min(0.5),
    availability: Joi.array().items(
      Joi.object().keys({
        _id: Joi.string(),
        dayOfWeek: Joi.string(),
        status: Joi.boolean().default(true),
        slots: Joi.array().items(
          Joi.object().keys({
            _id: Joi.string(),
            start_time: Joi.date().iso().required(),
            end_time: Joi.date().iso().required(),
          })
        ),
      })
    ),
    education: Joi.string(),
    degree: Joi.string(),
    institution: Joi.string(),
    passing_year: Joi.date(),
    speciality: Joi.array().items(Joi.string()).min(1).unique(),
    experience: Joi.number().integer().min(1),
    country: Joi.string(),
    license: Joi.array().items(Joi.string()).min(1),
    bankName: Joi.string(),
    accountNumber: Joi.string(),
  });

  GetDoctorSchema = Joi.object().keys({
    search: Joi.string().allow(""),
    location: Joi.string().allow(""),
    speciality: Joi.string(),
    filter: Joi.string().valid("favorite").allow(""),
    limit: Joi.number().integer().min(1).default(5),
    skip: Joi.number().integer().min(1).default(0),
    sort: Joi.string().valid("asc", "desc").default("desc"),
  });

  GetFavouriteDoctorSchema = Joi.object().keys({
    limit: Joi.number().integer().min(1).default(5),
    skip: Joi.number().integer().min(1).default(0),
    sort: Joi.string().valid("asc", "desc").default("desc"),
  });

  bookAppointmentSchema = Joi.object().keys({
    doctorId: Joi.string().required(),
    slotId: Joi.string().required(),
    bookingFor: Joi.string().valid("self", "dependent").required(),
    fullName: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    age: Joi.number().integer().min(1).required(),
    phone: Joi.string().required(),
    problem: Joi.string().required(),
    attachment: Joi.array().items(Joi.string()).unique().required(),
    bookingDate: Joi.date().iso().required(),
    amount: Joi.number().min(1).required(),
  });
  GetAppointmentListSchema = Joi.object().keys({
    _id: Joi.string(),
    filter: Joi.string().valid("upcoming", "cancelled", "completed"),
    limit: Joi.number().integer().min(1).default(5),
    skip: Joi.number().integer().min(1).default(0),
    sort: Joi.string().valid("asc", "desc").default("desc"),
  });
  GetAvailabilitySchema = Joi.object().keys({
    date: Joi.date().iso().default(new Date()).allow(""),
  });

  UpdateAppointmentSchema = Joi.object().keys({
    bookingStatus: Joi.string()
      .valid("booked", "completed", "cancelled")
      .required(),
    cancellationReason: Joi.string().required(),
  });

  GetAppointmentSchema = Joi.object().keys({
    filter: Joi.string().valid("upcoming", "cancelled", "completed"),
    limit: Joi.number().integer().min(1).default(5),
    skip: Joi.number().integer().min(1).default(0),
    sort: Joi.string().valid("asc", "desc").default("desc"),
  });
  GetReportSchema = Joi.object().keys({
    filter: Joi.string().valid(
      "weekly",
      "1month",
      "2month",
      "3month",
      "6month",
      "1year"
    ),
  });
}

export const {
  ObjectIdSchema,
  PatientSchema,
  DoctorSchema,
  GetDoctorSchema,
  GetFavouriteDoctorSchema,
  bookAppointmentSchema,
  GetAppointmentListSchema,
  GetAvailabilitySchema,
  UpdateAppointmentSchema,
  GetAppointmentSchema,
  GetReportSchema,
} = new UserValidator();
