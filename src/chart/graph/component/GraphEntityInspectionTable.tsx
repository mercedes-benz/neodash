import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const formatProperty = (property) => {
  if (property.startsWith('http://') || property.startsWith('https://')) {
    return <a href={property}>{property}</a>;
  }
  return property;
};

/**
 * Component to render node/relationship properties in a table format
 */
export const GraphEntityInspectionTable = ({
  entity,
  setSelectedParameters = (_value) => {
    console.log('undefined function in GraphEntityInspectionTable');
  },
  checklistEnabled = false,
  customTableDataSettingsForEntityType,
}) => {
  const [checkedParameters, setCheckedParameters] = React.useState<string[]>([]);
  const hasPropertyToShow = Object.keys(entity.properties).length > 0;

  /**
   * Set keys which needs to be displayed first in defined order
   */
  const orderedAttributeList = customTableDataSettingsForEntityType?.ordering || [];

  /**
   * Set rest of the keys in asc order which shoulc renders after the orderedAttributeList
   */
  const unOrderedAttributeList = Object.keys(entity.properties).filter(
    (value: string) => !orderedAttributeList.includes(value)
  );

  if (!entity) {
    return <></>;
  }

  /**
   * Function to manage the click
   * @param parameter
   * @param checked
   */
  function handleCheckboxClick(parameter, checked) {
    let newCheckedParameters = [...checkedParameters];
    if (checked) {
      newCheckedParameters.push(parameter);
    } else {
      const index = newCheckedParameters.indexOf(parameter);
      if (index > -1) {
        newCheckedParameters.splice(index, 1);
      }
    }
    if (setSelectedParameters) {
      setCheckedParameters(newCheckedParameters);
      setSelectedParameters(newCheckedParameters);
    }
  }

  return (
    <TableContainer>
      <Table size='small'>
        {hasPropertyToShow ? (
          <TableHead>
            <TableRow>
              <TableCell align='left'>Property</TableCell>
              <TableCell align='left'>Value</TableCell>
              {checklistEnabled ? <TableCell align='center'>Select Property</TableCell> : <></>}
            </TableRow>
          </TableHead>
        ) : (
          <></>
        )}
        <TableBody>
          {!hasPropertyToShow ? (
            <TableRow key='empty-row'>
              <TableCell component='th' scope='row'>
                (No properties)
              </TableCell>
            </TableRow>
          ) : (
            <>
              {orderedAttributeList
                .filter((attr: string) => !(customTableDataSettingsForEntityType.hide || []).includes(attr))
                .map((key: string) => (
                  <>
                    {entity && entity.properties[key] && (
                      <TableRow key={key}>
                        <TableCell component='th' scope='row'>
                          {key}
                        </TableCell>
                        <TableCell align={'left'}>
                          <ShowMoreText lines={2}>
                            {formatProperty(entity && entity.properties[key].toString())}
                          </ShowMoreText>
                        </TableCell>
                        {checklistEnabled ? (
                          <TableCell align={'center'}>
                            <Checkbox
                              color='default'
                              onChange={(event) => {
                                handleCheckboxClick(key, event.target.checked);
                              }}
                            />
                          </TableCell>
                        ) : (
                          <></>
                        )}
                      </TableRow>
                    )}
                  </>
                ))}
              {unOrderedAttributeList
                .filter((attr: string) => !(customTableDataSettingsForEntityType?.hide || []).includes(attr))
                .sort()
                .map((key: string) => (
                  <TableRow key={key}>
                    <TableCell component='th' scope='row'>
                      {key}
                    </TableCell>
                    <TableCell align={'left'}>
                      <ShowMoreText lines={2}>
                        {formatProperty(entity && entity.properties[key].toString())}
                      </ShowMoreText>
                    </TableCell>
                    {checklistEnabled ? (
                      <TableCell align={'center'}>
                        <Checkbox
                          color='default'
                          onChange={(event) => {
                            handleCheckboxClick(key, event.target.checked);
                          }}
                        />
                      </TableCell>
                    ) : (
                      <></>
                    )}
                  </TableRow>
                ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GraphEntityInspectionTable;
