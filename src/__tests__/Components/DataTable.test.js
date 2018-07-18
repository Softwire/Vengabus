import { DataTable } from "../../Components/DataTable";
import renderer from 'react-test-renderer';
import React from 'react';
import { css } from 'react-emotion';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adaptor() });

describe('DataTable', () => {

    it('displays correctly from given props', () => {

        const data = [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }];

        const ColProps = [
            {
                dataField: "number",
                text: "Number",
                headerStyle: { width: "10%" }
            },
            {
                dataField: "name",
                text: "Name",
                headerStyle: { width: "50%" }
            },
            {
                dataField: "status",
                text: "Status",
                headerStyle: { width: "40%" }
            }
        ];

        const RowEvents = {
            onClick: (e, row, rowIndex) => {
                console.log(row);
            }
        };

        const tableRowStyle = css`
    	          :hover {
    	              border: 2px solid grey;
    	              background-color: blue;
    	          }
    	      `;

        let dataTable = renderer.create(
            <DataTable
                ColProps={ColProps}
                DataToDisplay={data}
                RowEvents={RowEvents}
                tableRowStyle={tableRowStyle}
            />);

        expect(dataTable.toJSON()).toMatchSnapshot();
    });

});