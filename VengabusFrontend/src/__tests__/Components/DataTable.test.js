import { DataTable } from "../../Components/DataTable";
import renderer from 'react-test-renderer';
import React from 'react';
import { mount } from 'enzyme';
import { css } from 'emotion';
import { Button } from 'react-bootstrap';

const rawConsoleError = console.error;
function suppressSpecificDataTableErrors() {
    // We use '...args' to ensure that we are passing all args on to the actual console.error()
    // Can't use 'arguments' because that doesn't exist in ES6 arrow funcs.
    console.error = (...args) => {
        const errorString = args[0];
        if (!errorString.startsWith('The above error occurred in the <DataTable> component')) {
            rawConsoleError(...args);
        }
    };
}
function resetConsoleError() {
    console.error = rawConsoleError;
}

beforeAll(suppressSpecificDataTableErrors);
afterAll(resetConsoleError);

describe('DataTable', () => {

    function getDataToDisplay() {
        return [
            { numberWithComplexLabel: 1, name: 'q1', overridenField: 'text' },
            { numberWithComplexLabel: 2, name: 'q2', overridenField: 'text' },
            { numberWithComplexLabel: 3, name: 'q3', overridenField: 'text' }
        ];
    }

    function getColProps() {
        return [
            { dataField: "numberWithComplexLabel" },
            { dataField: "name" },
            { dataField: "overridenField", text: "Not the same as the dataField" }
        ];
    }

    it('renders without an error if only the required props are specified', () => {
        renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                uniqueKeyColumn='numberWithComplexLabel'
            />);
    });

    it('renders correctly if an empty array is input as data', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={[]}
                uniqueKeyColumn='numberWithComplexLabel'
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with the selectRow prop', () => {
        const selectRow = {
            bgColor: 'green',
            selected: 0,
            onSelect: () => { return; }
        };
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                selectRow={selectRow}
                uniqueKeyColumn='numberWithComplexLabel'
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly when defaultHover=true with an additional rowClasses prop', () => {
        const rowClasses = css`
                    background-color: grey;
              `;
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                rowClasses={rowClasses}
                uniqueKeyColumn='name'
                defaultHover
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly when formatter is used to render a button within cells', () => {
        let dataToDisplay = getDataToDisplay();
        dataToDisplay[0].button = 0;
        dataToDisplay[1].button = 1;
        dataToDisplay[2].button = 2;
        let colProps = getColProps(); 
        const getButton = (cell, row, rowIndex) => {
            return (
                <Button onClick={() => { return; }}>Button</ Button>
            );
        };
        colProps.push({ dataField: 'button', fomratter: getButton });
        let dataTable = renderer.create(
            <DataTable
                colProps={colProps}
                dataToDisplay={dataToDisplay}
                uniqueKeyColumn='name'
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('function is called correctly if only rowEvents is defined', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                rowEvents={{ onClick: spy }}
                rowClasses='row'
                uniqueKeyColumn='numberWithComplexLabel'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('click');
        expect(spy).toBeCalled();
    });

    it('calls function correctly if only onRowClick is defined', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                onRowClick={spy}
                rowClasses='row'
                uniqueKeyColumn='numberWithComplexLabel'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('click');
        expect(spy).toBeCalled();
    });

    it('calls click function correctly with both onRowClick and rowEvents defined', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                onRowClick={spy}
                rowEvents={{ onMouseEnter: function () { return; } }}
                rowClasses='row'
                uniqueKeyColumn='numberWithComplexLabel'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('click');
        expect(spy).toBeCalled();
    });

    it('calls mouse enter function correctly with both onRowClick and rowEvents defined', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                onRowClick={function () { return; }}
                rowEvents={{ onMouseEnter: spy }}
                rowClasses='row'
                uniqueKeyColumn='numberWithComplexLabel'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('mouseEnter');
        expect(spy).toBeCalled();
    });

    it('calls onSelect function correctly', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                rowClasses='row'
                selectRow={{ onSelect: spy }}
                uniqueKeyColumn='numberWithComplexLabel'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('click');
        expect(spy).toBeCalled();
    });

    it('throws a descriptive error if onClick function is defined twice', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    colProps={getColProps()}
                    dataToDisplay={getDataToDisplay()}
                    rowEvents={{ onClick: function () { return; } }}
                    onRowClick={function () { return; }}
                    name='test'
                    uniqueKeyColumn='numberWithComplexLabel'
                />);
        }
        expect(getDataTable).toThrow(new Error('the onClick event for rows is defined multiple times in test'));
    });

    it('throws a descriptive error if colProps is missing', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    name='test'
                    uniqueKeyColumn='numberWithComplexLabel'
                />);
        }
        expect(getDataTable).toThrow(new Error('column property object is not defined in test'));
    });

    it('throws a descriptive error if background color may be multiply defined on selectRow', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    colProps={getColProps()}
                    dataToDisplay={getDataToDisplay()}
                    selectRow={{ bgColor: 'green', classes: 'selectrow' }}
                    name='test'
                    uniqueKeyColumn='numberWithComplexLabel'
                />);
        }
        expect(getDataTable).toThrow(new Error('background color of selected row may be multiply defined in test'));
        function getDataTable2() {
            return mount(
                <DataTable
                    colProps={getColProps()}
                    dataToDisplay={getDataToDisplay()}
                    selectRow={{ bgColor: 'green', style: {} }}
                    name='test'
                    uniqueKeyColumn='numberWithComplexLabel'
                />);
        }
        expect(getDataTable2).toThrow(new Error('background color of selected row may be multiply defined in test'));
    });

    it('throws a descriptive error if missing a width definition', () => {
        let colProps = getColProps();
        colProps[0].width = 90;
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={colProps}
                    uniqueKeyColumn='numberWithComplexLabel'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('missing column width definition in test:name'));
    });

    it('throws a descriptive error if overall defined width is not 100%', () => {
        let colProps = getColProps();
        colProps[0].width = 80;
        colProps[1].width = 9;
        colProps[2].width = 10;
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={colProps}
                    uniqueKeyColumn='numberWithComplexLabel'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('overall width of columns is not 100% in test'));
    });

    it('throws a descriptive error if width is defined in the header style', () => {
        let colProps = getColProps();
        colProps[1].headerStyle = { width: '50%' };

        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={colProps}
                    uniqueKeyColumn='numberWithComplexLabel'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('width of column must not be specified in the style (in test:name)'));
    });

    it('throws a descriptive error if no key column', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={getColProps()}
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('need a valid key column in test'));
    });

    it('throws a descriptive error if key column is invalid', () => {
        function getDataTable2() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={getColProps()}
                    uniqueKeyColumn='invalid'
                    name='test'
                />);
        }
        expect(getDataTable2).toThrow(new Error('need a valid key column in test'));
    });

    it('throws a descriptive error if key column is not unique', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={getColProps()}
                    uniqueKeyColumn='overridenField'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('key column specified in test is not unique'));
    });

    it('throws a descriptive error if all columns are hidden', () => {
        function getDataTable() {
            let colProps = getColProps();
            colProps[0].hidden = true;
            colProps[1].hidden = true;
            colProps[2].hidden = true;
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={colProps}
                    uniqueKeyColumn='numberWithComplexLabel'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('cannot use table with only hidden columns (in test)'));
    });

});