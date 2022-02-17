export type SubClassName = { name: string; count: number; child?: string };

export type ClassNames = {
  [k: string]: SubClassName[];
};

export const classNameTemplate: ClassNames = {
  person: [
    {
      name: 'customer',
      count: 1,
      child: 'sub_person',
    },
    {
      name: 'guarantor',
      count: 10,
      child: 'sub_person',
    },
    {
      name: 'coborrower',
      count: 10,
      child: 'sub_person',
    },
  ],
  sub_person: [
    {
      name: 'spouse',
      count: 1,
    },
    {
      name: 'child',
      count: 10,
    },
    {
      name: 'contact_person',
      count: 5,
    },
  ],
  working_type: [
    {
      name: 'current_working',
      count: 1,
    },
    {
      name: 'additional_working',
      count: 2,
    },
    {
      name: 'previous_working',
      count: 3,
    },
  ],
  addr_type: [
    {
      name: 'additional_working_address',
      count: 5,
    },
    {
      name: 'current_working_address',
      count: 10,
    },
    {
      name: 'previous_working_address',
      count: 1,
    },
    {
      name: 'current_address',
      count: 5,
    },
    {
      name: 'mailing_address',
      count: 1,
    },
    {
      name: 'residential_address',
      count: 1,
    },
    {
      name: 'id_card_address',
      count: 1,
    },
  ],
};
