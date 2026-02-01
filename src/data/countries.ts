// Country and State data for registration form
export interface Country {
  name: string;
  code: string;
  states: string[];
}

export const countries: Country[] = [
  {
    name: "India",
    code: "IN",
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
      "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
      "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
      "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
      "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
    ]
  },
  {
    name: "United States",
    code: "US",
    states: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
      "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
      "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
      "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
      "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
      "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
      "West Virginia", "Wisconsin", "Wyoming"
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    states: ["England", "Scotland", "Wales", "Northern Ireland"]
  },
  {
    name: "Canada",
    code: "CA",
    states: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick",
      "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island",
      "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"
    ]
  },
  {
    name: "Australia",
    code: "AU",
    states: [
      "New South Wales", "Victoria", "Queensland", "Western Australia",
      "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
    ]
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    states: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"]
  },
  {
    name: "Singapore",
    code: "SG",
    states: ["Singapore"]
  },
  {
    name: "Malaysia",
    code: "MY",
    states: [
      "Johor", "Kedah", "Kelantan", "Malacca", "Negeri Sembilan", "Pahang",
      "Penang", "Perak", "Perlis", "Sabah", "Sarawak", "Selangor", "Terengganu",
      "Kuala Lumpur", "Labuan", "Putrajaya"
    ]
  },
  {
    name: "Nepal",
    code: "NP",
    states: ["Province 1", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"]
  },
  {
    name: "Bangladesh",
    code: "BD",
    states: ["Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"]
  },
  {
    name: "Sri Lanka",
    code: "LK",
    states: ["Central", "Eastern", "North Central", "Northern", "North Western", "Sabaragamuwa", "Southern", "Uva", "Western"]
  },
  {
    name: "Pakistan",
    code: "PK",
    states: ["Balochistan", "Khyber Pakhtunkhwa", "Punjab", "Sindh", "Islamabad", "Azad Kashmir", "Gilgit-Baltistan"]
  }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(c => c.code === code);
};

export const getStatesByCountry = (countryName: string): string[] => {
  const country = countries.find(c => c.name === countryName);
  return country?.states || [];
};
