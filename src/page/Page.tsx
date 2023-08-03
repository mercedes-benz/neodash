import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NeoAddCard from '../card/CardAddButton';
import NeoCard from '../card/Card';
import { getReports, getToolBox } from './PageSelectors';
import {
  addReportThunk,
  removeReportThunk,
  updatePageLayoutThunk,
  cloneReportThunk,
  moveReportToToolboxThunk,
  removeReportFromToolboxThunk,
} from './PageThunks';
import { getDashboardIsEditable, getPageNumber } from '../settings/SettingsSelectors';
import { getDashboardSettings } from '../dashboard/DashboardSelectors';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { GRID_COMPACTION_TYPE } from '../config/PageConfig';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import {
  Badge,
  Box,
  Card,
  CardContent,
  Fab,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
} from '@mui/material';

const ResponsiveGridLayout = WidthProvider(Responsive);

const truncateString = (str) => (str.length > 25 ? str.slice(0, 25) + '...' : str);

const ToolBox = ({ items, onTakeItem, isListOpen, handleButtonClick }) => (
  <Box position='fixed' bottom={16} right={16} zIndex={1}>
    {!isListOpen && (
      <Tooltip title='Minimized reports will appear here' placement='left' arrow>
        <Badge badgeContent={items.length} color='success'>
          <Fab color='primary' aria-label='up' onClick={handleButtonClick}>
            <UpIcon />
          </Fab>
        </Badge>
      </Tooltip>
    )}
    {isListOpen && (
      <Card variant='outlined' sx={{ minWidth: 275 }}>
        <CardContent>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {items.map((item, index) => (
              <ListItem
                key={item.i}
                disableGutters={false}
                secondaryAction={
                  <IconButton aria-label='comment' onClick={() => onTakeItem(item)}>
                    <AspectRatioIcon />
                  </IconButton>
                }
              >
                <Tooltip title={item.title} placement='left' arrow>
                  <ListItemText primary={`${index + 1}. ${truncateString(item.title)}`} />
                </Tooltip>
              </ListItem>
            ))}
          </List>
          <IconButton
            onClick={handleButtonClick}
            size='small'
            style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              backgroundColor: 'red',
            }}
          >
            <CloseIcon fontSize='small' style={{ color: 'white' }} />
          </IconButton>
        </CardContent>
      </Card>
    )}
  </Box>
);

/**
 * A component responsible for rendering the **current** page, a collection of reports.
 */
export const NeoPage = ({
  editable = true, // Whether the page is editable.
  dashboardSettings, // global settings for the entire dashboard.
  pagenumber, // The page number to render.
  reports = [], // list of reports as defined in the dashboard state.
  onCreatePressed = () => {}, // callback for when the user wants to add a new report.
  onClonePressed = () => {}, // callback/action to take when a user wants to clone a report
  onRemovePressed = () => {}, // action to take when a report gets removed.
  isLoaded = true, // Whether the page is loaded and the cards can be displayed.
  onPageLayoutUpdate = () => {}, // action to take when the page layout is updated.
  onMinimizeClick = () => {},
  onMaximizeClick = () => {},
  toolbox,
}) => {
  const getReportKey = (pagenumber: number, id: string) => {
    return `${pagenumber}:${id}`;
  };

  const defaultLayouts = {
    lg: [
      {
        x: 0,
        y: 0,
        i: getReportKey(pagenumber, '999999'),
        w: 3,
        h: 2,
        isDraggable: false,
      },
    ],
  };

  const loadingMessage = <div>Loading card...</div>;
  const [isDragging, setIsDragging] = React.useState(false);
  const [layouts, setLayouts] = React.useState(defaultLayouts);
  const [lastElement, setLastElement] = React.useState(<div key={getReportKey(pagenumber, '999999')}></div>);
  const [animated, setAnimated] = React.useState(false); // To turn off animations when cards are dragged around.
  const [isListOpen, setListOpen] = React.useState(true);
  const enableSaveButtonForIds = reports.filter(
    (report: any) => report.settings.hideQueryEditorInAutoRunOnMode === 'on'
  );
  const handleButtonClick = () => {
    setListOpen(!isListOpen);
  };

  const availableHandles = () => {
    if (dashboardSettings.resizing && dashboardSettings.resizing == 'all') {
      return ['s', 'w', 'e', 'sw', 'se'];
    }
    return ['se'];
  };

  const onTakeItem = (item) => {
    onMaximizeClick(item.id);
  };

  const onPutItem = (item) => {
    onMinimizeClick(item.id);
  };

  /**
   * Based on the current layout, determine where the 'add report' card should be placed.
   * The position here is the 'first available (2x2) spot' on a row, starting from the top.
   * @returns the position (x,y) of the add card button.
   */
  const getAddCardButtonPosition = () => {
    // Find all reports that touch on a specific y-level.
    if (reports.length == 0) {
      return { x: 0, y: 0 };
    }

    const maxY = Math.max.apply(
      Math,
      reports.map((o) => {
        return o.y + o.height;
      })
    );
    const maxXbyYLevel = {}; // The max x value for each y-level.
    for (let i = 0; i < maxY; i++) {
      maxXbyYLevel[i] = Math.max(
        0,
        Math.max.apply(
          Math,
          reports
            .filter((report) => report.y + report.height > i && report.y <= i)
            .map((o) => {
              return o.x + o.width;
            })
        )
      );
    }

    for (let level = 0; level < maxY; level++) {
      if (maxXbyYLevel[level] <= 9 && (maxXbyYLevel[level + 1] === undefined || maxXbyYLevel[level + 1] <= 9)) {
        return { x: maxXbyYLevel[level] !== undefined ? maxXbyYLevel[level] : 0, y: level };
      }
    }
    return { x: 0, y: maxY };
  };
  /**
   * Recompute the layout of the page buttons.This is called whenever the pages get reorganized.
   */
  const recomputeLayout = () => {
    const { x, y } = getAddCardButtonPosition();
    setLayouts({
      // @ts-ignore
      lg: [
        ...reports.map((report) => {
          return {
            x: report.x || 0,
            y: report.y || 0,
            i: getReportKey(pagenumber, report.id),
            w: Math.max(parseInt(report.width), 2) || 3,
            h: Math.max(parseInt(report.height), 1) || 2,
            minW: 2,
            minH: 1,
            resizeHandles: availableHandles(),
            isDraggable: true,
          };
        }),
        {
          x: x,
          y: y,
          i: getReportKey(pagenumber, '999999'),
          w: 3,
          h: 2,
          minW: 3,
          minH: 2,
          isDraggable: false,
          isResizable: false,
        },
      ],
    });
    setLastElement(
      <Grid style={{ paddingBottom: '6px' }} key={getReportKey(pagenumber, '999999')}>
        <NeoAddCard
          onCreatePressed={() => {
            const { x, y } = getAddCardButtonPosition();
            onCreatePressed(x, y, 3, 2);
          }}
        />
      </Grid>
    );
  };

  useEffect(() => {
    setAnimated(false);
    recomputeLayout();
  }, [reports, dashboardSettings.resizing]);

  const content = (
    <div style={{ paddingTop: '52px' }}>
      {toolbox && toolbox.length > 0 && (
        <ToolBox
          items={toolbox || []}
          onTakeItem={onTakeItem}
          handleButtonClick={handleButtonClick}
          isListOpen={isListOpen}
        />
      )}
      <ResponsiveGridLayout
        draggableHandle='.drag-handle'
        layouts={layouts}
        className={`layout neodash-card-editable-${editable} ${animated ? 'animated' : 'not-animated'}`}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={210}
        compactType={GRID_COMPACTION_TYPE}
        onDrag={() => {
          if (!isDragging) {
            setAnimated(true);
            setIsDragging(true);
            recomputeLayout();
          }
        }}
        onDragStop={(newLayout) => {
          if (isDragging) {
            onPageLayoutUpdate(newLayout);
            setIsDragging(false);
          }
        }}
        onResize={() => {
          setIsDragging(true);
          if (!animated) {
            setAnimated(true);
          }
        }}
        onResizeStop={(newLayout) => {
          setIsDragging(false);
          onPageLayoutUpdate(newLayout);
        }}
      >
        {reports.map((report) => {
          const w = 12;
          const { id } = report;
          // @ts-ignore
          return (
            <Grid
              key={getReportKey(pagenumber, id)}
              style={{ paddingBottom: '10px', marginBottom: '10px' }}
              item
              xs={Math.min(w * 4, 12)}
              sm={Math.min(w * 2, 12)}
              md={Math.min(w * 2, 12)}
              lg={Math.min(w, 12)}
              xl={Math.min(w, 12)}
            >
              <NeoCard
                id={id}
                key={getReportKey(pagenumber, id)}
                enableSaveButtonForIds={enableSaveButtonForIds}
                dashboardSettings={dashboardSettings}
                onRemovePressed={onRemovePressed}
                onPutItem={onPutItem}
                onClonePressed={(id) => {
                  const { x, y } = getAddCardButtonPosition();
                  onClonePressed(id, x, y);
                }}
              />
            </Grid>
          );
        })}
        {editable && !isDragging ? lastElement : null}
      </ResponsiveGridLayout>
    </div>
  );
  return !isLoaded ? loadingMessage : content;
};

const mapStateToProps = (state) => ({
  isLoaded: true,
  pagenumber: getPageNumber(state),
  editable: getDashboardIsEditable(state),
  dashboardSettings: getDashboardSettings(state),
  reports: getReports(state),
  toolbox: getToolBox(state),
});

const mapDispatchToProps = (dispatch) => ({
  onRemovePressed: (id) => dispatch(removeReportThunk(id)),
  onClonePressed: (id, x, y) => dispatch(cloneReportThunk(id, x, y)),
  onCreatePressed: (x, y, width, height) => dispatch(addReportThunk(x, y, width, height, undefined)),
  onPageLayoutUpdate: (layout) => dispatch(updatePageLayoutThunk(layout)),
  onMinimizeClick: (reportId) => dispatch(moveReportToToolboxThunk(reportId)),
  onMaximizeClick: (reportId) => dispatch(removeReportFromToolboxThunk(reportId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoPage);
