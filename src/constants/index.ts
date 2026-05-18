import type { PicklistOption } from '@/shared/components/blocks/Picklist';

export enum GenderType {
  Nam = 'nam',
  Nữ = 'nữ'
}

export const GenderTypeMap: Record<GenderType, string> = {
  [GenderType.Nữ]: 'Nữ',
  [GenderType.Nam]: 'Nam'
};

export const genderOptions: PicklistOption[] = [
  {
    label: 'Nữ',
    value: 'nữ'
  },
  {
    label: 'Nam',
    value: 'nam'
  }
];

export enum RoleType {
  ADMIN = 'admin',
  EXPERT = 'expert',
  PATIENT = 'patient'
  // RESEARCHER = 'researcher'
}

export const RoleTypeMap: Record<RoleType, string> = {
  [RoleType.EXPERT]: 'Expert',
  [RoleType.PATIENT]: 'Patient',
  [RoleType.ADMIN]: 'Admin'
};

export enum VerifyProfileStatus {
  Reject = 'rejected',
  Unverified = 'unverified',
  Verified = 'verified',
  WaitingForApproval = 'waiting_for_approval'
}

export const VerifyProfileStatusMap: Record<VerifyProfileStatus, string> = {
  [VerifyProfileStatus.Reject]: 'Rejected',
  [VerifyProfileStatus.Unverified]: 'Unverified',
  [VerifyProfileStatus.Verified]: 'Verified',
  [VerifyProfileStatus.WaitingForApproval]: 'Waiting for review'
};

export enum AccountStatus {
  Active = 'active',
  Block = 'block',
  Deleted = 'deleted',
  Pending = 'pending'
}

export const AccountStatusMap: Record<AccountStatus, string> = {
  [AccountStatus.Active]: 'Active',
  [AccountStatus.Block]: 'Block',
  [AccountStatus.Deleted]: 'Requested for delete',
  [AccountStatus.Pending]: 'Pending'
};

const COUNTRIES = [
  { name: 'Afghanistan', code: 'Afghanistan' },
  { name: 'Åland Islands', code: 'Åland Islands' },
  { name: 'Albania', code: 'Albania' },
  { name: 'Algeria', code: 'Algeria' },
  { name: 'American Samoa', code: 'American Samoa' },
  { name: 'AndorrA', code: 'AndorrA' },
  { name: 'Angola', code: 'Angola' },
  { name: 'Anguilla', code: 'Anguilla' },
  { name: 'Antarctica', code: 'Antarctica' },
  { name: 'Antigua and Barbuda', code: 'Antigua and Barbuda' },
  { name: 'Argentina', code: 'Argentina' },
  { name: 'Armenia', code: 'Armenia' },
  { name: 'Aruba', code: 'Aruba' },
  { name: 'Australia', code: 'Australia' },
  { name: 'Austria', code: 'Austria' },
  { name: 'Azerbaijan', code: 'Azerbaijan' },
  { name: 'Bahamas', code: 'Bahamas' },
  { name: 'Bahrain', code: 'Bahrain' },
  { name: 'Bangladesh', code: 'Bangladesh' },
  { name: 'Barbados', code: 'Barbados' },
  { name: 'Belarus', code: 'Belarus' },
  { name: 'Belgium', code: 'Belgium' },
  { name: 'Belize', code: 'Belize' },
  { name: 'Benin', code: 'Benin' },
  { name: 'Bermuda', code: 'Bermuda' },
  { name: 'Bhutan', code: 'Bhutan' },
  { name: 'Bolivia', code: 'Bolivia' },
  { name: 'Bosnia and Herzegovina', code: 'Bosnia and Herzegovina' },
  { name: 'Botswana', code: 'Botswana' },
  { name: 'Bouvet Island', code: 'Bouvet Island' },
  { name: 'Brazil', code: 'Brazil' },
  {
    name: 'British Indian Ocean Territory',
    code: 'British Indian Ocean Territory'
  },
  { name: 'Brunei Darussalam', code: 'Brunei Darussalam' },
  { name: 'Bulgaria', code: 'Bulgaria' },
  { name: 'Burkina Faso', code: 'Burkina Faso' },
  { name: 'Burundi', code: 'Burundi' },
  { name: 'Cambodia', code: 'Cambodia' },
  { name: 'Cameroon', code: 'Cameroon' },
  { name: 'Canada', code: 'Canada' },
  { name: 'Cape Verde', code: 'Cape Verde' },
  { name: 'Cayman Islands', code: 'Cayman Islands' },
  { name: 'Central African Republic', code: 'Central African Republic' },
  { name: 'Chad', code: 'Chad' },
  { name: 'Chile', code: 'Chile' },
  { name: 'China', code: 'China' },
  { name: 'Christmas Island', code: 'Christmas Island' },
  { name: 'Cocos (Keeling) Islands', code: 'Cocos (Keeling) Islands' },
  { name: 'Colombia', code: 'Colombia' },
  { name: 'Comoros', code: 'Comoros' },
  { name: 'Congo', code: 'Congo' },
  {
    name: 'Congo, The Democratic Republic of the',
    code: 'Congo, The Democratic Republic of the'
  },
  { name: 'Cook Islands', code: 'Cook Islands' },
  { name: 'Costa Rica', code: 'Costa Rica' },
  { name: "Cote D'Ivoire", code: "Cote D'Ivoire" },
  { name: 'Croatia', code: 'Croatia' },
  { name: 'Cuba', code: 'Cuba' },
  { name: 'Cyprus', code: 'Cyprus' },
  { name: 'Czech Republic', code: 'Czech Republic' },
  { name: 'Denmark', code: 'Denmark' },
  { name: 'Djibouti', code: 'Djibouti' },
  { name: 'Dominica', code: 'Dominica' },
  { name: 'Dominican Republic', code: 'Dominican Republic' },
  { name: 'Ecuador', code: 'Ecuador' },
  { name: 'Egypt', code: 'Egypt' },
  { name: 'El Salvador', code: 'El Salvador' },
  { name: 'Equatorial Guinea', code: 'Equatorial Guinea' },
  { name: 'Eritrea', code: 'Eritrea' },
  { name: 'Estonia', code: 'Estonia' },
  { name: 'Ethiopia', code: 'Ethiopia' },
  { name: 'Falkland Islands (Malvinas)', code: 'Falkland Islands (Malvinas)' },
  { name: 'Faroe Islands', code: 'Faroe Islands' },
  { name: 'Fiji', code: 'Fiji' },
  { name: 'Finland', code: 'Finland' },
  { name: 'France', code: 'France' },
  { name: 'French Guiana', code: 'French Guiana' },
  { name: 'French Polynesia', code: 'French Polynesia' },
  { name: 'French Southern Territories', code: 'French Southern Territories' },
  { name: 'Gabon', code: 'Gabon' },
  { name: 'Gambia', code: 'Gambia' },
  { name: 'Georgia', code: 'Georgia' },
  { name: 'Germany', code: 'Germany' },
  { name: 'Ghana', code: 'Ghana' },
  { name: 'Gibraltar', code: 'Gibraltar' },
  { name: 'Greece', code: 'Greece' },
  { name: 'Greenland', code: 'Greenland' },
  { name: 'Grenada', code: 'Grenada' },
  { name: 'Guadeloupe', code: 'Guadeloupe' },
  { name: 'Guam', code: 'Guam' },
  { name: 'Guatemala', code: 'Guatemala' },
  { name: 'Guernsey', code: 'Guernsey' },
  { name: 'Guinea', code: 'Guinea' },
  { name: 'Guinea-Bissau', code: 'Guinea-Bissau' },
  { name: 'Guyana', code: 'Guyana' },
  { name: 'Haiti', code: 'Haiti' },
  {
    name: 'Heard Island and Mcdonald Islands',
    code: 'Heard Island and Mcdonald Islands'
  },
  {
    name: 'Holy See (Vatican City State)',
    code: 'Holy See (Vatican City State)'
  },
  { name: 'Honduras', code: 'Honduras' },
  { name: 'Hong Kong', code: 'Hong Kong' },
  { name: 'Hungary', code: 'Hungary' },
  { name: 'Iceland', code: 'Iceland' },
  { name: 'India', code: 'India' },
  { name: 'Indonesia', code: 'Indonesia' },
  { name: 'Iran, Islamic Republic Of', code: 'Iran, Islamic Republic Of' },
  { name: 'Iraq', code: 'Iraq' },
  { name: 'Ireland', code: 'Ireland' },
  { name: 'Isle of Man', code: 'Isle of Man' },
  { name: 'Israel', code: 'Israel' },
  { name: 'Italy', code: 'Italy' },
  { name: 'Jamaica', code: 'Jamaica' },
  { name: 'Japan', code: 'Japan' },
  { name: 'Jersey', code: 'Jersey' },
  { name: 'Jordan', code: 'Jordan' },
  { name: 'Kazakhstan', code: 'Kazakhstan' },
  { name: 'Kenya', code: 'Kenya' },
  { name: 'Kiribati', code: 'Kiribati' },
  {
    name: "Korea, Democratic People'S Republic of",
    code: "Korea, Democratic People'S Republic of"
  },
  { name: 'Korea, Republic of', code: 'Korea, Republic of' },
  { name: 'Kuwait', code: 'Kuwait' },
  { name: 'Kyrgyzstan', code: 'Kyrgyzstan' },
  {
    name: "Lao People'S Democratic Republic",
    code: "Lao People'S Democratic Republic"
  },
  { name: 'Latvia', code: 'Latvia' },
  { name: 'Lebanon', code: 'Lebanon' },
  { name: 'Lesotho', code: 'Lesotho' },
  { name: 'Liberia', code: 'Liberia' },
  { name: 'Libyan Arab Jamahiriya', code: 'Libyan Arab Jamahiriya' },
  { name: 'Liechtenstein', code: 'Liechtenstein' },
  { name: 'Lithuania', code: 'Lithuania' },
  { name: 'Luxembourg', code: 'Luxembourg' },
  { name: 'Macao', code: 'Macao' },
  {
    name: 'Macedonia, The Former Yugoslav Republic of',
    code: 'Macedonia, The Former Yugoslav Republic of'
  },
  { name: 'Madagascar', code: 'Madagascar' },
  { name: 'Malawi', code: 'Malawi' },
  { name: 'Malaysia', code: 'Malaysia' },
  { name: 'Maldives', code: 'Maldives' },
  { name: 'Mali', code: 'Mali' },
  { name: 'Malta', code: 'Malta' },
  { name: 'Marshall Islands', code: 'Marshall Islands' },
  { name: 'Martinique', code: 'Martinique' },
  { name: 'Mauritania', code: 'Mauritania' },
  { name: 'Mauritius', code: 'Mauritius' },
  { name: 'Mayotte', code: 'Mayotte' },
  { name: 'Mexico', code: 'Mexico' },
  {
    name: 'Micronesia, Federated States of',
    code: 'Micronesia, Federated States of'
  },
  { name: 'Moldova, Republic of', code: 'Moldova, Republic of' },
  { name: 'Monaco', code: 'Monaco' },
  { name: 'Mongolia', code: 'Mongolia' },
  { name: 'Montserrat', code: 'Montserrat' },
  { name: 'Morocco', code: 'Morocco' },
  { name: 'Mozambique', code: 'Mozambique' },
  { name: 'Myanmar', code: 'Myanmar' },
  { name: 'Namibia', code: 'Namibia' },
  { name: 'Nauru', code: 'Nauru' },
  { name: 'Nepal', code: 'Nepal' },
  { name: 'Netherlands', code: 'Netherlands' },
  { name: 'Netherlands Antilles', code: 'Netherlands Antilles' },
  { name: 'New Caledonia', code: 'New Caledonia' },
  { name: 'New Zealand', code: 'New Zealand' },
  { name: 'Nicaragua', code: 'Nicaragua' },
  { name: 'Niger', code: 'Niger' },
  { name: 'Nigeria', code: 'Nigeria' },
  { name: 'Niue', code: 'Niue' },
  { name: 'Norfolk Island', code: 'Norfolk Island' },
  { name: 'Northern Mariana Islands', code: 'Northern Mariana Islands' },
  { name: 'Norway', code: 'Norway' },
  { name: 'Oman', code: 'Oman' },
  { name: 'Pakistan', code: 'Pakistan' },
  { name: 'Palau', code: 'Palau' },
  {
    name: 'Palestinian Territory, Occupied',
    code: 'Palestinian Territory, Occupied'
  },
  { name: 'Panama', code: 'Panama' },
  { name: 'Papua New Guinea', code: 'Papua New Guinea' },
  { name: 'Paraguay', code: 'Paraguay' },
  { name: 'Peru', code: 'Peru' },
  { name: 'Philippines', code: 'Philippines' },
  { name: 'Pitcairn', code: 'Pitcairn' },
  { name: 'Poland', code: 'Poland' },
  { name: 'Portugal', code: 'Portugal' },
  { name: 'Puerto Rico', code: 'Puerto Rico' },
  { name: 'Qatar', code: 'Qatar' },
  { name: 'Reunion', code: 'Reunion' },
  { name: 'Romania', code: 'Romania' },
  { name: 'Russian Federation', code: 'Russian Federation' },
  { name: 'RWANDA', code: 'RWANDA' },
  { name: 'Saint Helena', code: 'Saint Helena' },
  { name: 'Saint Kitts and Nevis', code: 'Saint Kitts and Nevis' },
  { name: 'Saint Lucia', code: 'Saint Lucia' },
  { name: 'Saint Pierre and Miquelon', code: 'Saint Pierre and Miquelon' },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'Saint Vincent and the Grenadines'
  },
  { name: 'Samoa', code: 'Samoa' },
  { name: 'San Marino', code: 'San Marino' },
  { name: 'Sao Tome and Principe', code: 'Sao Tome and Principe' },
  { name: 'Saudi Arabia', code: 'Saudi Arabia' },
  { name: 'Senegal', code: 'Senegal' },
  { name: 'Serbia and Montenegro', code: 'Serbia and Montenegro' },
  { name: 'Seychelles', code: 'Seychelles' },
  { name: 'Sierra Leone', code: 'Sierra Leone' },
  { name: 'Singapore', code: 'Singapore' },
  { name: 'Slovakia', code: 'Slovakia' },
  { name: 'Slovenia', code: 'Slovenia' },
  { name: 'Solomon Islands', code: 'Solomon Islands' },
  { name: 'Somalia', code: 'Somalia' },
  { name: 'South Africa', code: 'South Africa' },
  {
    name: 'South Georgia and the South Sandwich Islands',
    code: 'South Georgia and the South Sandwich Islands'
  },
  { name: 'Spain', code: 'Spain' },
  { name: 'Sri Lanka', code: 'Sri Lanka' },
  { name: 'Sudan', code: 'Sudan' },
  { name: 'Suriname', code: 'Suriname' },
  { name: 'Svalbard and Jan Mayen', code: 'Svalbard and Jan Mayen' },
  { name: 'Swaziland', code: 'Swaziland' },
  { name: 'Sweden', code: 'Sweden' },
  { name: 'Switzerland', code: 'Switzerland' },
  { name: 'Syrian Arab Republic', code: 'Syrian Arab Republic' },
  { name: 'Taiwan, Province of China', code: 'Taiwan, Province of China' },
  { name: 'Tajikistan', code: 'Tajikistan' },
  {
    name: 'Tanzania, United Republic of',
    code: 'Tanzania, United Republic of'
  },
  { name: 'Thailand', code: 'Thailand' },
  { name: 'Timor-Leste', code: 'Timor-Leste' },
  { name: 'Togo', code: 'Togo' },
  { name: 'Tokelau', code: 'Tokelau' },
  { name: 'Tonga', code: 'Tonga' },
  { name: 'Trinidad and Tobago', code: 'Trinidad and Tobago' },
  { name: 'Tunisia', code: 'Tunisia' },
  { name: 'Turkey', code: 'Turkey' },
  { name: 'Turkmenistan', code: 'Turkmenistan' },
  { name: 'Turks and Caicos Islands', code: 'Turks and Caicos Islands' },
  { name: 'Tuvalu', code: 'Tuvalu' },
  { name: 'Uganda', code: 'Uganda' },
  { name: 'Ukraine', code: 'Ukraine' },
  { name: 'United Arab Emirates', code: 'United Arab Emirates' },
  { name: 'United Kingdom', code: 'United Kingdom' },
  { name: 'United States', code: 'United States' },
  {
    name: 'United States Minor Outlying Islands',
    code: 'United States Minor Outlying Islands'
  },
  { name: 'Uruguay', code: 'Uruguay' },
  { name: 'Uzbekistan', code: 'Uzbekistan' },
  { name: 'Vanuatu', code: 'Vanuatu' },
  { name: 'Venezuela', code: 'Venezuela' },
  { name: 'Viet Nam', code: 'Viet Nam' },
  { name: 'Virgin Islands, British', code: 'Virgin Islands, British' },
  { name: 'Virgin Islands, U.S.', code: 'Virgin Islands, U.S.' },
  { name: 'Wallis and Futuna', code: 'Wallis and Futuna' },
  { name: 'Western Sahara', code: 'Western Sahara' },
  { name: 'Yemen', code: 'Yemen' },
  { name: 'Zambia', code: 'Zambia' },
  { name: 'Zimbabwe', code: 'Zimbabwe' }
];

export const countryOptions = COUNTRIES.map((country) => ({
  label: country.name,
  value: country.code
}));
