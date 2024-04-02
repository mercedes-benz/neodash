import React from 'react';
import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { getEntityHeader } from '../util/NodeUtils';
import { Dialog } from '@neo4j-ndl/react';
import GraphEntityInspectionTable from './GraphEntityInspectionTable';

/**
 * Renders a pop-up window to inspect a node/relationship properties in a read-only table.
 */
export const NeoGraphChartInspectModal = (props: GraphChartVisualizationProps) => {
  /**
   * @author <em>Mercedes-benz</em>
   * @description Added as a part of vulcan-134
   * ===========================================================================================================
   */
  let headerName = '';
  const selectedEntity: any = props.interactivity?.selectedEntity;
  const customTablePropertiesOfModal = props.interactivity?.customTablePropertiesOfModal;

  // Check if the user clicked relationship or edge
  const isRelationShipTypeExists = selectedEntity ? Object.getOwnPropertyNames(selectedEntity).includes('type') : false;
  if (selectedEntity) {
    // Get header name of modal based on the node or edge clicked by user
    headerName = isRelationShipTypeExists
      ? selectedEntity?.labels || selectedEntity?.type
      : getEntityHeader(props.interactivity.selectedEntity, props?.engine?.selection);
  }

  /**
   * @param properties
   * @returns custom settings of selected node/edge from settings if specified.
   */
  const getSettingsByEntityType = (properties: any[]) =>
    properties.find((setting) => setting.entityType === headerName);

  /**
   * check if customTablePropertiesOfModal is an array or else return empty object.
   */
  const customTableDataSettingsForEntityType = Array.isArray(customTablePropertiesOfModal)
    ? getSettingsByEntityType(customTablePropertiesOfModal)
    : {};
  /**
   * ===========================================================================================================
   * @author <em>Mercedes-benz</em>
   * @description Added as a part of vulcan-134
   */

  return (
    <div>
      <Dialog
        size='large'
        open={props.interactivity.showPropertyInspector}
        onClose={() => props.interactivity.setPropertyInspectorOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>
          {props.interactivity.selectedEntity
            ? getEntityHeader(props.interactivity.selectedEntity, props?.engine?.selection)
            : ''}
        </Dialog.Header>
        <Dialog.Content>
          <GraphEntityInspectionTable
            entity={selectedEntity}
            theme={props.style.theme}
            customTableDataSettingsForEntityType={customTableDataSettingsForEntityType}
          />
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default NeoGraphChartInspectModal;
