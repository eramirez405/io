import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import styled from 'styled-components';
import RingLoader from 'react-spinners/RingLoader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
  ComposedChart,
} from 'recharts';
import 'moment/locale/es-do';
import moment from 'moment';
import NavModal from '../nav/NavModal';

const Dashboard = ({ location: { pathname } }) => {
  const [ioValues, setIoValues] = useState(null);
  const [navModalOpen, setNavModalOpen] = useState(false);

  const {
    V12,
    V23,
    V31,
    A1,
    A2,
    A3,
    kWIII,
    kvarIII,
    kVAIII,
    kWhIII,
    MdkWIII,
    THDV1,
    THDV2,
    THDV3,
    THDI1,
    THDI2,
    THDI3,
    Hz,
    FP,
  } = ioValues || {};
  var ws;
  var wsUri = 'ws:';
  var loc = window.location;
  if (loc.protocol === 'https:') {
    wsUri = 'wss:';
  }
  wsUri = 'wss://192.168.1.150:1880/ws/io';

  function wsConnect() {
    ws = new WebSocket(wsUri);
    ws.onmessage = function (msg) {
      setIoValues(JSON.parse(msg.data));
    };
    ws.onopen = function () {
      // console.log('connected');
    };
    ws.onclose = function () {
      setTimeout(wsConnect, 3000);
    };
  }

  useEffect(() => {
    if (!!!ws) {
      wsConnect();
    }
    return () => {
      if (!!ws && ws.statusReady === 1) {
        ws.disconnect();
      }
    };
  }, []);

  if (!!ioValues) {
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
            {(!!V12 || V12 === 0) && (
              <div className='box col-md-3 flex-column'>
                <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                  Voltaje L1 - L2
                </div>
                <GaugeChart
                  id='gauge-chart1'
                  nrOfLevels={480}
                  arcsLength={[0.45, 0.125, 0.425]}
                  colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                  percent={V12 / 480}
                  arcPadding={0.02}
                  textColor='black'
                  formatTextValue={(value) =>
                    Math.round(value * 4.8 * 100) / 100 + 'V'
                  }
                />
              </div>
            )}
            {(!!V23 || V23 === 0) && (
              <div className='box col-md-3 flex-column'>
                <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                  Voltaje L2 - L3
                </div>
                <GaugeChart
                  id='gauge-chart2'
                  nrOfLevels={480}
                  arcsLength={[0.45, 0.125, 0.425]}
                  colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                  percent={V23 / 480}
                  arcPadding={0.02}
                  textColor='black'
                  formatTextValue={(value) =>
                    Math.round(value * 4.8 * 100) / 100 + 'V'
                  }
                />
              </div>
            )}
            {(!!V31 || V31 === 0) && (
              <div className='box col-md-3 flex-column'>
                <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                  Voltaje L3 - L1
                </div>
                <GaugeChart
                  id='gauge-chart3'
                  nrOfLevels={480}
                  arcsLength={[0.45, 0.125, 0.425]}
                  colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                  percent={V31 / 480}
                  arcPadding={0.02}
                  textColor='black'
                  formatTextValue={(value) =>
                    Math.round(value * 4.8 * 100) / 100 + 'V'
                  }
                />
              </div>
            )}
          </div>
          <br />
          <div className='row'>
            <div className='col-md-2 col-6 flex-column text-center justify-content-center'>
              <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                Corriente L1
              </div>
              <div style={{ display: 'inline-block', paddingRight: '20px' }}>
                <BarChart
                  width={150}
                  height={200}
                  data={[
                    {
                      name: 'Amps',
                      uv: A1,
                    },
                  ]}
                >
                  <XAxis dataKey='name' type='category' />
                  <YAxis domain={[0, 3200]} />
                  <Bar dataKey='uv' fill='rgb(91 225 44 / 84%)'>
                    <LabelList dataKey='uv' position='top' />
                  </Bar>
                </BarChart>
              </div>
            </div>

            <div className='col-md-2 col-6 flex-column text-center'>
              <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                Corriente L2
              </div>
              <div style={{ display: 'inline-block', paddingRight: '20px' }}>
                <ResponsiveContainer width={150} height={200}>
                  <BarChart
                    width={730}
                    data={[
                      {
                        name: 'Amps',
                        uv: A2,
                      },
                    ]}
                  >
                    <XAxis dataKey='name' type='category' />
                    <YAxis domain={[0, 3200]} />
                    <Bar dataKey='uv' fill='rgb(91 225 44 / 84%)'>
                      <LabelList dataKey='uv' position='top' />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='col-md-2 col-6 flex-column text-center'>
              <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                Corriente L3
              </div>
              <div style={{ display: 'inline-block', paddingRight: '20px' }}>
                <ResponsiveContainer width={150} height={200}>
                  <BarChart
                    width={730}
                    data={[
                      {
                        name: 'Amps',
                        uv: A3,
                      },
                    ]}
                  >
                    <XAxis dataKey='name' type='category' />
                    <YAxis domain={[0, 3200]} />
                    <Bar dataKey='uv' fill='rgb(91 225 44 / 84%)'>
                      <LabelList dataKey='uv' position='top' />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='col-md-2 col-6 flex-column text-center'>
              <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                Potencia Activa
              </div>
              <div style={{ display: 'inline-block', paddingRight: '20px' }}>
                <ResponsiveContainer width={150} height={200}>
                  <BarChart
                    width={730}
                    data={[
                      {
                        name: 'kW',
                        uv: kWIII,
                      },
                    ]}
                  >
                    <XAxis dataKey='name' type='category' />
                    <YAxis domain={[0, 1500]} />
                    <Bar dataKey='uv' fill='rgb(91 225 44 / 84%)'>
                      <LabelList dataKey='uv' position='top' />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='col-md-2 col-6 flex-column text-center'>
              <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                Potencia Reactiva
              </div>
              <div style={{ display: 'inline-block', paddingRight: '20px' }}>
                <ResponsiveContainer width={150} height={200}>
                  <BarChart
                    width={730}
                    data={[
                      {
                        name: 'kVAR',
                        uv: kvarIII,
                      },
                    ]}
                  >
                    <XAxis dataKey='name' type='category' />
                    <YAxis domain={[-1000, 1000]} />
                    <Bar dataKey='uv' fill='rgb(91 225 44 / 84%)'>
                      <LabelList dataKey='uv' position='top' />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='col-md-2 col-6 flex-column text-center'>
              <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                Potencia Aparente
              </div>
              <div style={{ display: 'inline-block', paddingRight: '20px' }}>
                <ResponsiveContainer width={150} height={200}>
                  <BarChart
                    width={730}
                    data={[
                      {
                        name: 'kVA',
                        uv: kVAIII,
                      },
                    ]}
                  >
                    <XAxis dataKey='name' type='category' />
                    <YAxis domain={[0, 1500]} />
                    <Bar dataKey='uv' fill='rgb(91 225 44 / 84%)'>
                      <LabelList dataKey='uv' position='top' />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-3'>
              <table className='table text-center'>
                <thead style={{ background: '#5be12c99' }}>
                  <tr>
                    <th scope='col'>Energía activa total consumida</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#5be12c3d' }}>
                    <td>{kWhIII} kWh</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='col-md-3'>
              <table className='table text-center'>
                <thead style={{ background: '#5be12c99' }}>
                  <tr>
                    <th scope='col'>Máxima demanda</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#5be12c3d' }}>
                    <td>{MdkWIII} W</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='col-md-3'>
              <table className='table text-center'>
                <thead style={{ background: '#5be12c99' }}>
                  <tr>
                    <th scope='col'>Frecuencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#5be12c3d' }}>
                    <td>{Hz} Hz</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='col-md-3'>
              <table className='table text-center'>
                <thead style={{ background: '#5be12c99' }}>
                  <tr>
                    <th scope='col'>Factor de potencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#5be12c3d' }}>
                    <td>{FP}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <table className='table text-center'>
                <thead style={{ background: '#5be12c99' }}>
                  <tr>
                    <th scope='col'></th>
                    <th scope='col'>% THD tensión</th>
                    <th scope='col'></th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#5be12c3d' }}>
                    <td>L1 : {THDV1} %</td>
                    <td>L2 : {THDV2} %</td>
                    <td>L3 : {THDV3} %</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='col-md-6'>
              <table className='table text-center'>
                <thead style={{ background: '#5be12c99' }}>
                  <tr>
                    <th scope='col'></th>
                    <th scope='col'>% THD corriente</th>
                    <th scope='col'></th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#5be12c3d' }}>
                    <td>L1 : {THDI1} %</td>
                    <td>L2 : {THDI2} %</td>
                    <td>L3 : {THDI3} %</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <NavModal
          isOpen={navModalOpen}
          onRequestClose={() => setNavModalOpen(false)}
          pathname={pathname}
        />
      </Wrapper>
    );
  } else {
    return (
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RingLoader size={150} color='#f5a423d4' />
      </div>
    );
  }
};

export default Dashboard;

const Wrapper = styled.div`
  .box {
    display: flex;
    align-items: center;
  }
`;
