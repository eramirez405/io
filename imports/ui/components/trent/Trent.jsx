import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FiArrowLeftCircle,
  FiArrowRightCircle,
  FiFolderPlus,
  FiAirplay,
  FiRefreshCw,
} from 'react-icons/fi';
import styled from 'styled-components';
import Select from 'react-select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import RingLoader from 'react-spinners/RingLoader';
import format from 'date-fns/format';
import NavModal from '../nav/NavModal';
import moment from 'moment';
import eachHourOfInterval from 'date-fns/eachHourOfInterval';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import RenderTooltip from './RenderTooltip';

colors = [
  '#28B463',
  '#F5B041',
  '#3498DB',
  '#5D6D7E',
  '#884EA0',
  '#884EA0',
  '#884EA0',
  '#E74C3C',
  '#17A589',
];

const options = [
  { value: 'V12', label: 'Voltaje L1 - L2', unit: 'v' },
  { value: 'V23', label: 'Voltaje L2 - L3', unit: 'v' },
  { value: 'V31', label: 'Voltaje L3 - L1', unit: 'v' },
  { value: 'A1', label: 'Corriente L1', unit: 'amp' },
  { value: 'A2', label: 'Corriente L2', unit: 'amp' },
  { value: 'A3', label: 'Corriente L3', unit: 'amp' },
  { value: 'kWIII', label: 'Potencia Activa', unit: 'kW' },
  { value: 'kvarIII', label: ' Potencia Reactiva', unit: 'kVAR' },
  { value: 'kVAIII', label: 'Potencia Aparente', unit: 'kVA' },
  { value: 'kWhIII', label: 'Energía activa total consumida', unit: 'kWh' },
  { value: 'MdkWIII', label: 'Máxima demanda', unit: 'kW' },
  { value: 'Hz', label: 'Frecuencia', unit: 'Hz' },
  { value: 'FP', label: 'Factor de potencia', unit: '' },
  { value: 'THDV1', label: '% THD tensión L1', unit: '%' },
  { value: 'THDV2', label: '% THD tensión L2', unit: '%' },
  { value: 'THDV3', label: '% THD tensión L3', unit: '%' },
  { value: 'THDI1', label: '% THD corriente L1', unit: '%' },
  { value: 'THDI2', label: '% THD corriente L2', unit: '%' },
  { value: 'THDI3', label: '% THD corriente L3', unit: '%' },
];

const Trent = ({ location: { pathname } }) => {
  const [display, setDisplay] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [validation, setValidation] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [navModalOpen, setNavModalOpen] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    if (display !== '' && !!selectedFilter) {
      setLoading(true);
      Meteor.call(
        'getHistory',
        display,
        startDate,
        endDate,
        selectedFilter,
        (e, r) => {
          setLoading(false);
          if (e) {
            console.log(e);
            setValidation('Something Happened, check logs');
          }
          if (r) {
            if (r.length > 1) {
              const interval = { start: r[0].date, end: r[r.length - 1].date };
              const hours = eachHourOfInterval(interval).length;
              const days = eachDayOfInterval(interval).length;
              const months = eachMonthOfInterval(interval).length;

              if (months > 1) {
                setData(
                  r.map((e) => {
                    e.dateOriginal = e.date;
                    e.date = format(e.date, 'MMM d');
                    return e;
                  })
                );
              } else if (days > 1) {
                setData(
                  r.map((e) => {
                    e.dateOriginal = e.date;
                    e.date = format(e.date, 'iii d');
                    return e;
                  })
                );
              } else if (hours > 1) {
                setData(
                  r.map((e) => {
                    e.dateOriginal = e.date;
                    e.date = format(e.date, 'h:mm:s');
                    return e;
                  })
                );
              } else {
                setData(
                  r.map((e) => {
                    e.dateOriginal = e.date;
                    e.date = format(e.date, 'mm:s');
                    return e;
                  })
                );
              }
            } else {
              setData(
                r.map((e) => {
                  e.dateOriginal = e.date;
                  e.date = format(e.date, 'h:mm s');
                  return e;
                })
              );
            }
            setValidation('')
          }
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
              </div>
              <div className='form-row align-items-center'>
                <div className='col-md-8'>
                  <div className='input-group mb-2'>
                    <div className='input-group-prepend'>
                      <div className='input-group-text'>
                        <FiFolderPlus />
                      </div>
                    </div>
                    <Select
                      isClearable
                      className={'select'}
                      placeholder='Filter'
                      value={selectedFilter}
                      isMulti={true}
                      onChange={(value) => setSelectedFilter(value)}
                      options={options}
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
            <ResponsiveContainer width='100%' height={450}>
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='date'
                  minTickGap={10}
                  interval='preserveStartEnd'
                  // tickFormatter={(t) => moment(t).format('MMMM Do')}
                />
                <YAxis type='number' domain={['dataMin', 'dataMax']} />
                <Tooltip content={RenderTooltip} />
                {!!selectedFilter &&
                  selectedFilter.length > 0 &&
                  selectedFilter.map((e, i) => (
                    <Area
                      key={e.value}
                      unit={e.unit}
                      type='monotoneX'
                      dataKey={e.value}
                      stroke={colors[i] || '#D35400'}
                      fill={colors[i] || '#D35400'}
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          )
        )}
      </div>
      <NavModal
        isOpen={navModalOpen}
        onRequestClose={() => setNavModalOpen(false)}
        pathname={pathname}
      />
    </Wrapper>
  );
};

export default Trent;

const Wrapper = styled.div`
  .react-datepicker {
    width: max-content;
  }
  .select,
  .react-datepicker-wrapper {
    width: 80%;
  }
`;
