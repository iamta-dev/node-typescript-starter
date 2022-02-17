import fs from 'fs';
import { GenerateFieldFormClassName, GetThkFieldName, GetInsertSQL, DataSourceSubGroupFields, GetDataDourceSubGroupId, MapDataSourceSubGroupIds, GetClassNamesFromFieldTemplate } from './tools';
import { Input } from './input';

const fileNameJSON = 'insert.json';
const fileNameSQL = 'insert.sql';

// 34837 KK-SIT in latest
// 34984 BF-DEV in latest
let rowIndexStart = 34985;
type GenerateField = {
  fieldTemplate: string;
  genField: string[];
};

// main function
try {
  let output: GenerateField[] = [];
  Input.forEach(fieldTemplate => {
    output.push({
      fieldTemplate: fieldTemplate,
      genField: GenerateFieldFormClassName(fieldTemplate),
    });
  });

  let fileSql = '';

  fileSql += `BEGIN;\n\n`
  fileSql += `INSERT INTO universe.migrations("number", name)\n`
  fileSql += `	VALUES (319, '0319_20220218_add_data_source_sub_group_fields.sql');\n\n`
  fileSql += `DO $$\n`
  fileSql += `BEGIN\n\n`

  // Generate INSERT scripts
  output.forEach((GenField: GenerateField) => {
    fileSql += `-- INSERT INTO universe.data_source_sub_group_fields ${GenField.fieldTemplate}\n`;
    const classNames: string[] = GetClassNamesFromFieldTemplate(GenField.fieldTemplate);
    if (classNames.includes('person')) {
      GenField.genField.forEach(compositeFieldName => {
        const insertValue: DataSourceSubGroupFields = {
          id: rowIndexStart,
          data_source_sub_group_id: GetDataDourceSubGroupId(compositeFieldName),
          object_type: 'OPTIONAL',
          composite_field_name: compositeFieldName,
          thk_field_name: GetThkFieldName(compositeFieldName),
        };
        rowIndexStart++;
        fileSql += GetInsertSQL(insertValue);
      });
    } else if (classNames.length == 0) {
      MapDataSourceSubGroupIds.forEach(dataSourceSubGroupId => {
        const insertValue: DataSourceSubGroupFields = {
          id: rowIndexStart,
          data_source_sub_group_id: dataSourceSubGroupId.data_source_sub_group_id,
          object_type: 'OPTIONAL',
          composite_field_name: GenField.fieldTemplate,
          thk_field_name: GetThkFieldName(GenField.fieldTemplate),
        };
        rowIndexStart++;
        fileSql += GetInsertSQL(insertValue);
      });
    } else {
      throw new Error(`not support classNames: ${classNames}`);
    }
    fileSql += `\n\n`;
  });

  fileSql += `\n\nEND; $$;\n\n`
  fileSql += `COMMIT;\n\n`

  fs.writeFile(fileNameJSON, JSON.stringify(output), function(err) {
    console.log(`File ${fileNameJSON} is created successfully.`);
  });

  // fs.writeFile(fileNameSQL, fileSql, function(err) {
  //   console.log(`File ${fileNameSQL} is created successfully.`);
  // });

} catch (error) {
  throw error;
}
