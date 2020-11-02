import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import RingLoader from 'react-spinners/RingLoader';
import NavModal from '../nav/NavModal';
import moment from 'moment';
import {
    FiArrowLeftCircle,
    FiArrowRightCircle,
    FiAirplay,
    FiRefreshCw,
  } from 'react-icons/fi';
import format from 'date-fns/format';
import DataTable from 'react-data-table-component';

const keyTransform = (_key) => {
    let res = '';
    switch (_key) {
        case 'AlarmHiVL1':
            res = 'Alto voltaje L1'
            break;
        case 'AlarmHiVL2':
            res = 'Alto voltaje L2'
            break;
        case 'AlarmHiVL3':
            res = 'Alto voltaje L3'
            break;
        case 'AlarmLwVL1':
            res = 'Bajo voltaje L1'
            break;
        case 'AlarmLwVL2':
            res = 'Bajo voltaje L2'
            break;
        case 'AlarmLwVL3':
            res = 'Bajo voltaje L3'
            break;
        case 'AlarmIL1':
            res = 'Alta corriente L1'
            break;
        case 'AlarmIL2':
            res = 'Alta corriente L2'
            break;
        case 'AlarmIL3':
            res = 'Alta corriente L3'
            break;
        case 'AlarmTHDV1':
            res = 'THD% voltaje excedido L1'
            break;
        case 'AlarmTHDV2':
            res = 'THD% voltaje excedido L2'
            break;
        case 'AlarmTHDV3':
            res = 'THD% voltaje excedido L3'
            break;
        case 'AlarmTHDI1':
            res = 'THD% corriente excedido L1'
            break;
        case 'AlarmTHDI2':
            res = 'THD% corriente excedido L1'
            break;
        case 'AlarmTHDI3':
            res = 'THD% corriente excedido L1'
            break;
        case 'AlarmHiF':
            res = 'Alta frecuencia'
            break;
        case 'AlarmLwF':
            res = 'Baja frecuencia'
            break;
        case 'AlarmHiFP':
            res = 'Alto factor de potencia'
            break;
        case 'AlarmLwFP':
            res = 'Bajo factor de potencia'
            break;
        default:
            res = ''
            break;
    }
    return res;
}

const valueTransform = (_value) => {
    let res = '';
    switch (_value) {
        case 0:
            res = 'normalizada'
            break;
        case 1:
            res = 'activa'
            break;
        case 2:
            res = 'reconocida'
            break;
        default:
            res = ''
            break;
    }
    return res
}

const columns = [
    {
      name: 'Logs',
      selector: 'log',
      sortable: true,
    },
    {
      name: 'Date',
      selector: 'date',
      sortable: true,
      right: true,
      hide: 'md',
      format: (row) => format(row.date, 'dd/MM/yyyy hh:mm:ss aaaa'),
    },
  ];

const AlarmHistory = ({ location: { pathname } }) => {
  const [display, setDisplay] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [navModalOpen, setNavModalOpen] = useState(false);
  const [validation, setValidation] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    if (display !== '') {
      setLoading(true);
      Meteor.call(
        'getHistoryAlarms',
        display,
        startDate,
        endDate,
        (e, r) => {
          if (e) {
            console.log(e);
            setValidation('Something Happened, check logs');
          }
          if (r && r.length > 0) {
              let processed = []
              for (let i = 0; i < r.length; i++) {
                  const item = r[i];
                  if (i > 0) {
                    const prevItem = r[i - 1]
                    for (var [key, value] of Object.entries(item)) {
                        if (key !== 'date' && key !== '_id' && value !== prevItem[key]) {
                            processed.push({ log : `${keyTransform(key)} --> ${valueTransform(value)}`, date : item.date })
                        }
                    }
                  } else {
                    for (var [key, value] of Object.entries(item)) {
                        if (value !== 0 && key !== 'date' && key !== '_id') {
                            processed.push({ log : `${keyTransform(key)} --> ${valueTransform(value)}`, date : item.date })
                        }
                    }
                  }
              }
              setData(processed)
              setValidation('')
          }
          setLoading(false);
        }
      );
    } else {
      setValidation('Please complete all the fields');
    }
  };

    return (
        <Wrapper>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'>
            <img
              src='plasticos.webp'
              alt='logo'
              style={{ width: '300px', padding: '15px', cursor: 'pointer' }}
              onClick={() => setNavModalOpen(true)}
            />
            <div style={{ textTransform: 'capitalize' }}>
              {moment().format('dddd, D MMMM YYYY, h:mm a')}
            </div>
          </div>
          <div className='col-md-9'>
            <form className='m-4' onSubmit={onSubmit}>
              <div className='form-row align-items-center'>
                <div className='col-md-4'>
                  <div className='input-group mb-2'>
                    <div className='input-group-prepend'>
                      <div className='input-group-text'>
                        <FiAirplay />
                      </div>
                    </div>
                    <select
                      value={display}
                      onChange={(e) => setDisplay(e.target.value)}
                      className='form-control'
                    >
                      <option value='' style={{ display: 'none' }}>
                        Choose...
                      </option>
                      <option value='display1'>Display 1</option>
                      <option value='display2'>Display 2</option>
                      <option value='display3'>Display 3</option>
                    </select>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='input-group mb-2'>
                    <div className='input-group-prepend'>
                      <div className='input-group-text'>
                        <FiArrowLeftCircle />
                      </div>
                    </div>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeSelect
                      timeFormat='hh:mm a'
                      timeIntervals={15}
                      timeCaption='time'
                      dateFormat='MMMM d, yyyy h:mm aa'
                      className='form-control'
                    />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='input-group mb-2'>
                    <div className='input-group-prepend'>
                      <div className='input-group-text'>
                        <FiArrowRightCircle />
                      </div>
                    </div>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      showTimeSelect
                      timeFormat='hh:mm a'
                      timeIntervals={15}
                      timeCaption='time'
                      dateFormat='MMMM d, yyyy h:mm aa'
                      className='form-control'
                    />
                  </div>
                </div>
                <div className='col-md-4 d-flex justify-content-between'>
                  <button type='submit' className='btn btn-primary mb-2 d-flex'>
                    <FiRefreshCw size={18} className='my-1' />
                  </button>
                  <div>
                    <small style={{ color: 'red' }}>{validation}</small>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <br />
        {loading ? (
          <div className='d-flex justify-content-center'>
            <RingLoader size={150} color='#f5a423d4' />
          </div>
        ) : (
          !!data && (
            <DataTable
        noHeader
        data={data}
        columns={columns}
        title='Alarms'
        highlightOnHover={true}
        pagination={true}
        paginationPerPage={6}
        paginationRowsPerPageOptions={[6, 10, 15, 20, 25, 30]}
      />
          )
        )}
      </div>
      <NavModal
        isOpen={navModalOpen}
        onRequestClose={() => setNavModalOpen(false)}
        pathname={pathname}
      />
    </Wrapper>
    )
}

export default AlarmHistory

const Wrapper = styled.div`
  .react-datepicker {
    width: max-content;
  }
  .select,
  .react-datepicker-wrapper {
    width: 80%;
  }
`;