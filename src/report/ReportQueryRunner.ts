import { extractNodePropertiesFromRecords, extractNodeAndRelPropertiesFromRecords } from './ReportRecordProcessing';
import { Record } from 'neo4j-driver';
import isEqual from 'lodash.isequal';

export enum QueryStatus {
  NO_QUERY, // No query specified
  NO_DATA, // No data was returned, therefore we can't draw it.
  NO_DRAWABLE_DATA, // There is data returned, but we can't draw it
  WAITING, // The report is waiting for custom logic to be executed.
  RUNNING, // The report query is running.
  TIMED_OUT, // Query has reached the time limit.
  COMPLETE, // There is data returned, and we can visualize it all.
  COMPLETE_TRUNCATED, // There is data returned, but it's too much so we truncate it.
  ERROR, // Something broke, likely the cypher query is invalid.
}

// TODO: create a readOnly version of this method or inject a property
/**
 * Runs a Cypher query using the specified driver.
 * @param driver - an instance of a Neo4j driver.
 * @param database - optionally, the Neo4j database to run the query against.
 * @param query - the cypher query to run.
 * @param parameters - an optional set of query parameters.
 * @param rowLimit - optionally, the maximum number of rows to retrieve.
 * @param setStatus - callback to retrieve query status.
 * @param setRecords  - callback to retrieve query records.
 * @param setFields - callback to set list of returned query fields.
 * @param queryTimeLimit - maximum query time in seconds.
 * @returns
 */

export async function runCypherQuery(
  driver,
  database = '',
  query = '',
  parameters = {},
  rowLimit = 1000,
  setStatus = (status) => {
    // eslint-disable-next-line no-console
    console.log(`Query runner attempted to set status: ${JSON.stringify(status)}`);
  },
  setRecords = (records) => {
    // eslint-disable-next-line no-console
    console.log(`Query runner attempted to set records: ${JSON.stringify(records)}`);
  },
  setFields = (fields) => {
    // eslint-disable-next-line no-console
    console.log(`Query runner attempted to set fields: ${JSON.stringify(fields)}`);
  },
  fields = [],
  useNodePropsAsFields = false,
  useReturnValuesAsFields = false,
  useHardRowLimit = false,
  queryTimeLimit = 20,
  setSchema = () => {
    // eslint-disable-next-line no-console
    // console.log(`Query runner attempted to set schema: ${JSON.stringify(schema)}`);
  }
) {
  console.log('Query>>', query);
  console.log('Params>>', parameters);

  // If no query specified, we don't do anything.
  if (query.trim() == '') {
    setFields([]);
    setStatus(QueryStatus.NO_QUERY);
    return;
  }

  // Send query and get records from backend
  await fetch('http://localhost:3002/records', {
    method: 'POST',
    body: JSON.stringify({
      cypherQuery: query,
      parameters: parameters,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => {
      // @ts-ignore
      return response.json();
    })
    .then((fetchedData) => {
      const records = [];
      // const records = fetchedData;
      fetchedData.forEach((recordData) => {
        // Create a new Record instance for each item and push it to the records array
        const record = new Record(recordData.keys, recordData._fields, recordData._fieldLookup);
        records.push(record);
      });

      console.log('Printing records:');
      console.log(records);

      // TODO - check query summary to ensure that no writes are made in safe-mode.
      if (records.length == 0) {
        setStatus(QueryStatus.NO_DATA);

        return;
      }

      if (useReturnValuesAsFields) {
        // Send a deep copy of the returned record keys as the set of fields.
        const newFields = records && records[0] && records[0].keys ? records[0].keys.slice() : [];

        if (!isEqual(newFields, fields)) {
          setFields(newFields);
        }
      } else if (useNodePropsAsFields) {
        // If we don't use dynamic field mapping, but we do have a selection, use the discovered node properties as fields.
        const nodePropsAsFields = extractNodePropertiesFromRecords(records);
        setFields(nodePropsAsFields);
      }

      setSchema(extractNodeAndRelPropertiesFromRecords(records));

      if (records == null) {
        setStatus(QueryStatus.NO_DRAWABLE_DATA);

        return;
      } else if (records.length > rowLimit) {
        setStatus(QueryStatus.COMPLETE_TRUNCATED);
        setRecords(records.slice(0, rowLimit));

        return;
      }
      setStatus(QueryStatus.COMPLETE);

      setRecords(records);
    })
    .catch((e) => {
      // setFields([]);

      // Process timeout errors.
      if (
        e.message.startsWith(
          'The transaction has been terminated. ' +
            'Retry your operation in a new transaction, and you should see a successful result. ' +
            'The transaction has not completed within the specified timeout (dbms.transaction.timeout).'
        )
      ) {
        setStatus(QueryStatus.TIMED_OUT);
        setRecords([{ error: e.message }]);

        return e.message;
      }

      setStatus(QueryStatus.ERROR);
      // Process other errors.
      if (setRecords) {
        setRecords([{ error: e.message }]);
      }
      return e.message;
    });
}
