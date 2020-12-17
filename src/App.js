import React from 'react'
import styled from 'styled-components'
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
    useRowSelect,
  useExpanded,
} from 'react-table'
import matchSorter from 'match-sorter'
import jsondata from './data.json'
import jsontestdata from './testdata.json'
import makeData from './makeData'
// import { useSticky } from 'react-table-sticky';

const Styles = styled.div`
  padding: 1rem;

  table {
    width: 100%;
    margin-left: 210px;
    margin-top: 25px;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      th:first-child {
        text-align: left;
        font-weight: normal;
        position: sticky;
        left: 0px;
        z-index: 1;
        background-color: inherit;
      }
    }
    tbody {
      display: block;
    }
    
    thead > tr {
      position: sticky;
      left: 0;
      top: 0;
      z-index: 1;
      height: auto;
      display: block;
      th:first-child {
        background-color: "e5e3e8";
        text-align: center;
      }
    }

    th,
    td {
      min-width: 16rem;
      max-width: 16rem;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid "e5e3e8";
      border-right: 1px solid "e5e3e8";
    }

    td {
      input {
        border: 1;
        font-size: 1rem;
        width: 0.5rem;
        padding: 1;
        margin: 1;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
    margin-left: 210px;
  }
  
  .json-info {
    margin-left: 210px;
  }
  .action {
    margin-left: 210px;
  }
   
   
  // &.sticky {
  //   // overflow: hidden;
  //  
  //   opacity: 1.0;
  //   margin-left: 210px;
  //   .header,
  //   .footer {
  //   position: sticky;
  //   z-index: 1;
  //   width: fit-content;
  // }
  //
  // .header {      
  //   top: 0;
  //   box-shadow: 0px 3px 3px #ccc;
  // }
  
  .frozen-column {
    background-color: #e5e3e8;
  }
`

// Create an editable cell renderer


// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Be sure to pass our updateMyData and the skipReset option
//function Table({ columns, data, updateMyData, skipReset })
function Table({ columns, data, skipReset, setSelectedRows }) {

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // And also our default editable cell
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getToggleHideAllColumnsProps,
    getTableBodyProps,
      allColumns,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      pageIndex,
      pageSize,
      sortBy,
      groupBy,
      expanded,
      filters,
      selectedRowIds,
    },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
      defaultColumn,
      filterTypes,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      // We also need to pass this so the page doesn't change
      // when we edit the data.
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
      useRowSelect,
      // useSticky,

          hooks => {
      hooks.visibleColumns.push(columns => {
        return [
          {
            id: 'selection',
            // Make this column a groupByBoundary. This ensures that groupBy columns
            // are placed after it
            groupByBoundary: true,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]
      })
    }
  )
  React.useEffect(()=>{
    setSelectedRows(selectedRowIds);
  },[setSelectedRows,selectedRowIds])


  // Render the UI for your table
  return (
    <>
        <div class="column-filters">
        <div>
          <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
          All
        </div>
        {allColumns.map(column => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
              {column.id}
            </label>
          </div>
        ))}
        <br />
      </div>
      <table {...getTableProps()} className="table sticky">
        <thead className="header">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  <div>
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? '🛑 ' : '⭕ '}
                      </span>
                    ) : null}
                    <span {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '📖' : '📕'}
                          </span>{' '}
                          {cell.render('Cell', { editable: false })} (
                          {row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render('Cell', { editable: true })
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <pre>
        <div className="json-info">
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              sortBy,
              groupBy,
              expanded: expanded,
              filters,
              selectedRowIds: selectedRowIds,
            },
            null,
            2
          )}
        </code></div>
      </pre>
    </>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

// This is a custom aggregator that
// takes in an array of leaf values and
// returns the rounded median
function roundedMedian(leafValues) {
  let min = leafValues[0] || 0
  let max = leafValues[0] || 0

  leafValues.forEach(value => {
    min = Math.min(min, value)
    max = Math.max(max, value)
  })

  return Math.round((min + max) / 2)
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

function App() {
  // <div className="fixed-header">
  const columns = React.useMemo(
    () => [

      //         {
      //   // Build our expander column
      //   id: 'expander', // Make sure it has an ID
      //
      //   Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
      //     <span {...getToggleAllRowsExpandedProps()}>
      //       {isAllRowsExpanded ? 'x' : 'y'}
      //     </span>
      //   ),
      //   Cell: ({ row }) =>
      //     // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
      //     // to build the toggle for expanding a row
      //     row.canExpand ? (
      //       <span
      //         {...row.getToggleRowExpandedProps({
      //           style: {
      //             // We can even use the row.depth property
      //             // and paddingLeft to indicate the depth
      //             // of the row
      //             paddingLeft: `${row.depth * 2}rem`,
      //           },
      //         })}
      //       >
      //         {row.isExpanded ? '👇' : '👉'}
      //       </span>
      //     ) : null,
      // },
      {
      Header: 'Study',
        columns: [
            {
            Header: 'IDs',
            accessor: 'Study_ID',
            // className: "frozen-column"
          },
          {
            Header: 'Desc.',
            accessor: 'Study_Description',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
            canGroupBy: false,
          },
          {
            Header: 'Name.',
            accessor: 'Study_Name',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
            canGroupBy: false,
          },
          {
            Header: 'Rating',
            accessor: 'Study_Rating',
            Filter: SelectColumnFilter,
            filter: 'includes',
            canGroupBy: false,
          },
          {
            Header: 'Comments',
            accessor: 'Study_Comments',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
            canGroupBy: false,
          },

        ],
      },
      {
        Header: 'Scans',
        columns: [
          {
            Header: 'ID',
            accessor: 'Scan_ID',
            Filter: SliderColumnFilter,
            filter: 'equals',
            canGroupBy: false,
          },
          {
            Header: 'Name',
            accessor: 'Scan_Name',
            Filter: SelectColumnFilter,
            filter: 'includes',
            canGroupBy: false,
          },
            {
            Header: 'Time',
            accessor: 'Scan_Time',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
            canGroupBy: false,
          },
            {
            Header: 'FOV',
            accessor: 'FOV',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
            canGroupBy: false,
          },
            {
            Header: 'Echotime',
            accessor: 'Echotime',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            // Aggregate the sum of all visits
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            canGroupBy: false,
          },
            {
            Header: 'Rep. Time',
            accessor: 'Repetitiontime',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            // Aggregate the sum of all visits
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            canGroupBy: false,
          },
            {
            Header: '# Rep.',
            accessor: 'Nrepetition',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            // Aggregate the sum of all visits
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            canGroupBy: false,
          },
            {
            Header: 'Spat. Res.',
            accessor: 'SpatResol',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
            canGroupBy: false,
          },
            {
            Header: 'Thickness',
            accessor: 'SliceThick',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            // Aggregate the sum of all visits
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            canGroupBy: false,
          },
            {
            Header: '# Slice',
            accessor: 'NSlice',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            // Aggregate the sum of all visits
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            canGroupBy: false,
          },
            {
            Header: 'Slice Gap',
            accessor: 'SliceGap',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            // Aggregate the sum of all visits
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            canGroupBy: false,
          },
            {
            Header: 'Slice Dist.',
            accessor: 'SliceDistance',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            // Aggregate the sum of all visits
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            canGroupBy: false,
          },
          {
            Header: 'Orientation',
            accessor: 'SliceOrient',
            Filter: SelectColumnFilter,
            filter: 'includes',
            canGroupBy: false,
          }
        ],
      },
    ],
    []
  )

  const data = jsondata
  const [originalData] = React.useState(data)

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  // const skipResetRef = React.useRef(false)

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  // const updateMyData = (rowIndex, columnId, value) => {
  //   // We also turn on the flag to not reset the page
  //   skipResetRef.current = true
  //   setData(old =>
  //     old.map((row, index) => {
  //       if (index === rowIndex) {
  //         return {
  //           ...row,
  //           [columnId]: value,
  //         }
  //       }
  //       return row
  //     })
  //   )


  // After data changes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  // React.useEffect(() => {
  //   skipResetRef.current = false
  // }, [data])
  //
  // // Let's add a data resetter/randomizer to help
  // // illustrate that flow...
  //
  const [selectedRows, setSelectedRows] = React.useState({});
  return (
    <Styles>
      <button className="action" onClick={()=>alert(JSON.stringify(selectedRows, null ,2))}>Download selected</button>

      <Table
        columns={columns}
        data={data}
        setSelectedRows={setSelectedRows}
        //updateMyData={updateMyData}
      />
    </Styles>
  )
      // </div>
}

export default App
