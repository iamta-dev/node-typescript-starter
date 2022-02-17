import { classNameTemplate, SubClassName } from './classNameTemplate';

export const GetClassNamesFromFieldTemplate = (fieldName: string): string[] => {
  const replFieldName = (str: string): string => {
    str = str.replace('<', '{');
    str = str.replace('>', '}');
    return str;
  };

  let output: string[] = [];
  while (fieldName.search('<') != -1 || fieldName.search('>') != -1) {
    if ((fieldName.search('<') != -1 && fieldName.search('>') == -1) || (fieldName.search('<') == -1 && fieldName.search('>') != -1)) {
      throw new Error(`error : invalid format variable ${fieldName}`);
    }

    let indexStart = fieldName.search('<');
    let indexEnd = fieldName.search('>');
    let className = indexStart != -1 && indexEnd != -1 ? fieldName.slice(indexStart + 1, indexEnd) : '';

    if (className.match(/^[a-z_]*$/) == null) {
      throw new Error(`error : invalid format className: ${className}`);
    }
    if (className != '') {
      output.push(className);
    }

    fieldName = replFieldName(fieldName);
  }

  return output;
};

const GenerateFieldFormSubClassName = (fieldName: string, replAt: string, subClassNames: SubClassName[] | undefined): string[] => {
  if (subClassNames == undefined) {
    throw new Error(`error : not found className: ${replAt} is classNameTemplate`);
  }

  let output: string[] = [];
  subClassNames.forEach(subClassName => {
    // have child
    if (subClassName.child) {
      // repldefault
      if (subClassName.count > 1) {
        for (let i = 1; i <= subClassName.count; i++) {
          const subClassNameIndex = subClassName.name + '#' + i;
          const childFieldName = fieldName.replace(replAt, subClassNameIndex);
          output.push(childFieldName);
        }
        // count = 1
      } else {
        const childFieldName = fieldName.replace(replAt, subClassName.name);
        output.push(childFieldName);
      }

      // replChild
      const childSubClassNameReplAt = '<' + subClassName.child + '>';
      // count > 1
      if (subClassName.count > 1) {
        for (let i = 1; i <= subClassName.count; i++) {
          const subClassNameIndex = subClassName.name + '#' + i;
          const childFieldName = fieldName.replace(replAt, subClassNameIndex + '.' + childSubClassNameReplAt);

          const childSubClassName = classNameTemplate[subClassName.child];
          output.push(...GenerateFieldFormSubClassName(childFieldName, childSubClassNameReplAt, childSubClassName));
        }

        // count = 1
      } else {
        const childFieldName = fieldName.replace(replAt, subClassName.name + '.' + childSubClassNameReplAt);

        const childSubClassName = classNameTemplate[subClassName.child];
        output.push(...GenerateFieldFormSubClassName(childFieldName, childSubClassNameReplAt, childSubClassName));
      }

      // not child
    } else {
      // count > 1
      if (subClassName.count > 1) {
        for (let i = 1; i <= subClassName.count; i++) {
          const subClassNameIndex = subClassName.name + '#' + i;
          const childFieldName = fieldName.replace(replAt, subClassNameIndex);
          output.push(childFieldName);
        }
        // count = 1
      } else {
        const childFieldName = fieldName.replace(replAt, subClassName.name);
        output.push(childFieldName);
      }
    }
  });

  return output;
};

export const GenerateFieldFormClassName = (fieldTemplate: string): string[] => {
  let output: string[] = [];

  const classNames: string[] = GetClassNamesFromFieldTemplate(fieldTemplate);
  if (classNames.length > 0) {
    const className = classNames[0];
    const sunClassName = classNameTemplate[className];
    const replAt = '<' + className + '>';

    const newFieldTemplates = GenerateFieldFormSubClassName(fieldTemplate, replAt, sunClassName);
    newFieldTemplates.forEach(newFieldTemplate => {
      output.push(...GenerateFieldFormClassName(newFieldTemplate));
    });
  } else {
    output.push(fieldTemplate);
  }

  return output;
};

export type DataSourceSubGroupFields = {
  id: number;
  data_source_sub_group_id: number;
  object_type?: 'OPTIONAL' | 'REQUIRED';
  composite_field_name: string;
  active?: boolean;
  thk_field_name: string;
  is_trigger?: boolean;
};

export const GetInsertSQL = (insetValue: DataSourceSubGroupFields) => {
  insetValue.object_type = 'OPTIONAL';
  insetValue.active = true;
  insetValue.is_trigger = true;

  return `INSERT INTO universe.data_source_sub_group_fields ( id, data_source_sub_group_id, object_type, composite_field_name, active, updated_user_id, updated_time, created_time, thk_field_name, is_trigger ) VALUES ( ${insetValue.id}, ${insetValue.data_source_sub_group_id}, '${insetValue.object_type}', '${insetValue.composite_field_name}', TRUE, '', NOW(), NOW(), '${insetValue.thk_field_name}', TRUE );\n`;
};

export const GetThkFieldName = (compositeFieldName: string): string => {
  const charStart = compositeFieldName.lastIndexOf('.') + 1;
  if (charStart != -1) {
    const charEnd = compositeFieldName.length;
    return compositeFieldName.slice(charStart, charEnd);
  }
  throw new Error(`can not get thk_field_name in compositeFieldName: ${compositeFieldName}`);
};

type DataSourceSubGroupId = {
  person: string;
  data_source_sub_group_id: number;
};

export const MapDataSourceSubGroupIds: DataSourceSubGroupId[] = [
  //  validate customer
  {
    person: '.customer.',
    data_source_sub_group_id: 452,
  },
  // validate guarantor
  {
    person: '.guarantor#1.',
    data_source_sub_group_id: 453,
  },
  {
    person: '.guarantor#2.',
    data_source_sub_group_id: 454,
  },
  {
    person: '.guarantor#3.',
    data_source_sub_group_id: 455,
  },
  {
    person: '.guarantor#4.',
    data_source_sub_group_id: 456,
  },
  {
    person: '.guarantor#5.',
    data_source_sub_group_id: 457,
  },
  {
    person: '.guarantor#6.',
    data_source_sub_group_id: 458,
  },
  {
    person: '.guarantor#7.',
    data_source_sub_group_id: 459,
  },
  {
    person: '.guarantor#8.',
    data_source_sub_group_id: 460,
  },
  {
    person: '.guarantor#9.',
    data_source_sub_group_id: 461,
  },
  {
    person: '.guarantor#10.',
    data_source_sub_group_id: 462,
  },
  // validate coborrower
  {
    person: '.coborrower#1.',
    data_source_sub_group_id: 463,
  },
  {
    person: '.coborrower#2.',
    data_source_sub_group_id: 464,
  },
  {
    person: '.coborrower#3.',
    data_source_sub_group_id: 465,
  },
  {
    person: '.coborrower#4.',
    data_source_sub_group_id: 466,
  },
  {
    person: '.coborrower#5.',
    data_source_sub_group_id: 467,
  },
  {
    person: '.coborrower#6.',
    data_source_sub_group_id: 468,
  },
  {
    person: '.coborrower#7.',
    data_source_sub_group_id: 469,
  },
  {
    person: '.coborrower#8.',
    data_source_sub_group_id: 470,
  },
  {
    person: '.coborrower#9.',
    data_source_sub_group_id: 471,
  },
  {
    person: '.coborrower#10.',
    data_source_sub_group_id: 472,
  },
];

export const GetDataDourceSubGroupId = (compositeFieldName: string): number => {
  let dataSourceSubGroupId = -1;
  MapDataSourceSubGroupIds.forEach((valid: DataSourceSubGroupId) => {
    if (compositeFieldName.includes(valid.person)) dataSourceSubGroupId = valid.data_source_sub_group_id;
  });
  if (dataSourceSubGroupId != -1) {
    return dataSourceSubGroupId;
  }
  throw new Error(`can not get data_source_sub_group_id in compositeFieldName: ${compositeFieldName}`);
};
