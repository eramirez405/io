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
  const [wsSave, setWsSave] = useState(null)

  const {
    V1,
    V2,
    V3,
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
    MdkVAIII,
    MdkvarL,
    MdkvarC,
    THDV1,
    THDV2,
    THDV3,
    THDI1,
    THDI2,
    THDI3,
    Hz,
    FP,
    AlarmHiVL1,
    AlarmHiVL2,
    AlarmHiVL3,
    AlarmLwVL1,
    AlarmLwVL2,
    AlarmLwVL3,
    AlarmIL1,
    AlarmIL2,
    AlarmIL3,
    AlarmTHDV1,
    AlarmTHDV2,
    AlarmTHDV3,
    AlarmTHDI1,
    AlarmTHDI2,
    AlarmTHDI3,
    AlarmHiF,
    AlarmLwF,
    AlarmHiFP,
    AlarmLwFP,
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
    setWsSave(ws)
  }

  function sendMessage(m) {
    if (wsSave) { 
      wsSave.send(m); 
    }
  }

  useEffect(() => {
    if (!!!wsSave) {
      wsConnect();
    }
    return () => {
      if (!!wsSave && wsSave.statusReady === 1) {
        wsSave.disconnect();
      }
    };
  }, []);

  if (!!ioValues) {
    return (
      <Wrapper>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-2'>
              <img
                src='/plasticos.webp'
                alt='logo'
                style={{ width: '100%', padding: '15px', cursor: 'pointer' }}
                onClick={() => setNavModalOpen(true)}
              />
              <div
                style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
              >
                {moment().format('dddd, D MMMM YYYY, h:mm a')}
              </div>
              <br/>
              <h1 style={{ textAlign : 'center' }}>Sistema de Medición Integrado</h1>
              <br/>
              <ul className="list-group" style={{ height : '40%', overflow : 'auto' }}>
                <li className="list-group-item active">Alertas</li>
                {AlarmHiVL1 === 1 && (<li className="list-group-item list-group-item-danger">Alto voltaje L1</li>)}
                {AlarmHiVL1 === 2 && (<li className="list-group-item list-group-item-warning">Alto voltaje L1</li>)}
                {AlarmHiVL2 === 1 && (<li className="list-group-item list-group-item-danger">Alto voltaje L2</li>)}
                {AlarmHiVL2 === 2 && (<li className="list-group-item list-group-item-warning">Alto voltaje L2</li>)}
                {AlarmHiVL3 === 1 && (<li className="list-group-item list-group-item-danger">Alto voltaje L3</li>)}
                {AlarmHiVL3 === 2 && (<li className="list-group-item list-group-item-warning">Alto voltaje L3</li>)}
                {AlarmLwVL1 === 1 && (<li className="list-group-item list-group-item-danger">Bajo voltaje L1</li>)}
                {AlarmLwVL1 === 2 && (<li className="list-group-item list-group-item-warning">Bajo voltaje L1</li>)}
                {AlarmLwVL2 === 1 && (<li className="list-group-item list-group-item-danger">Bajo voltaje L2</li>)}
                {AlarmLwVL2 === 2 && (<li className="list-group-item list-group-item-warning">Bajo voltaje L2</li>)}
                {AlarmLwVL3 === 1 && (<li className="list-group-item list-group-item-danger">Bajo voltaje L3</li>)}
                {AlarmLwVL3 === 2 && (<li className="list-group-item list-group-item-warning">Bajo voltaje L3</li>)}
                {AlarmIL1 === 1 && (<li className="list-group-item list-group-item-danger">Alta corriente L1</li>)}
                {AlarmIL1 === 2 && (<li className="list-group-item list-group-item-warning">Alta corriente L1</li>)}
                {AlarmIL2 === 1 && (<li className="list-group-item list-group-item-danger">Alta corriente L2</li>)}
                {AlarmIL2 === 2 && (<li className="list-group-item list-group-item-warning">Alta corriente L2</li>)}
                {AlarmIL3 === 1 && (<li className="list-group-item list-group-item-danger">Alta corriente L3</li>)}
                {AlarmIL3 === 2 && (<li className="list-group-item list-group-item-warning">Alta corriente L3</li>)}
                {AlarmTHDV1 === 1 && (<li className="list-group-item list-group-item-danger">Alto THD% voltaje L1</li>)}
                {AlarmTHDV1 === 2 && (<li className="list-group-item list-group-item-warning">Alto THD% voltaje L1</li>)}
                {AlarmTHDV2 === 1 && (<li className="list-group-item list-group-item-danger">Alto THD% voltaje L2</li>)}
                {AlarmTHDV2 === 2 && (<li className="list-group-item list-group-item-warning">Alto THD% voltaje L2</li>)}
                {AlarmTHDV3 === 1 && (<li className="list-group-item list-group-item-danger">Alto THD% voltaje L3</li>)}
                {AlarmTHDV3 === 2 && (<li className="list-group-item list-group-item-warning">Alto THD% voltaje L3</li>)}
                {AlarmTHDI1 === 1 && (<li className="list-group-item list-group-item-danger">Alto THD corriente L1</li>)}
                {AlarmTHDI1 === 2 && (<li className="list-group-item list-group-item-warning">Alto THD corriente L1</li>)}
                {AlarmTHDI2 === 1 && (<li className="list-group-item list-group-item-danger">Alto THD corriente L2</li>)}
                {AlarmTHDI2 === 2 && (<li className="list-group-item list-group-item-warning">Alto THD corriente L2</li>)}
                {AlarmTHDI3 === 1 && (<li className="list-group-item list-group-item-danger">Alto THD corriente L3</li>)}
                {AlarmTHDI3 === 2 && (<li className="list-group-item list-group-item-warning">Alto THD corriente L3</li>)}
                {AlarmHiF === 1 && (<li className="list-group-item list-group-item-danger">Alta frecuencia</li>)}
                {AlarmHiF === 2 && (<li className="list-group-item list-group-item-warning">Alta frecuencia</li>)}
                {AlarmLwF === 1 && (<li className="list-group-item list-group-item-danger">Baja frecuencia</li>)}
                {AlarmLwF === 2 && (<li className="list-group-item list-group-item-warning">Baja frecuencia</li>)}
                {AlarmHiFP === 1 && (<li className="list-group-item list-group-item-danger">Alto factor de potencia</li>)}
                {AlarmHiFP === 2 && (<li className="list-group-item list-group-item-warning">Alto factor de potencia</li>)}
                {AlarmLwFP === 1 && (<li className="list-group-item list-group-item-danger">Bajo factor de potencia</li>)}
                {AlarmLwFP === 2 && (<li className="list-group-item list-group-item-warning">Bajo factor de potencia</li>)}
              </ul>
              <br/>
              <div className='d-flex justify-content-center'>
              <button type="button" style={{ width : '95%' }} className="btn btn-success" onClick={() => sendMessage('ack')}>Ack</button>
              </div>
            </div>
            <div className='col-md-10'>
              <h2 style={{ textAlign : 'center' }}>Panel Producción Principal</h2>
              <h3 style={{ textAlign : 'center' }}>[SW-PB]</h3>
              {/* <div className='row'>
                {(!!V1 || V1 === 0) && (
                  <div className='box col-md-2 flex-column'>
                    <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                      Voltaje L1
                    </div>
                    <GaugeChart
                      id='gauge-chart11'
                      nrOfLevels={240}
                      arcsLength={[0.45, 0.125, 0.425]}
                      colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                      percent={V1 / 240}
                      arcPadding={0.02}
                      textColor='black'
                      formatTextValue={(value) =>
                        Math.round(value * 2.4 * 100) / 100 + 'V'
                      }
                    />
                  </div>
                )}
                {(!!V2 || V2 === 0) && (
                  <div className='box col-md-2 flex-column'>
                    <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                      Voltaje L2
                    </div>
                    <GaugeChart
                      id='gauge-chart22'
                      nrOfLevels={240}
                      arcsLength={[0.45, 0.125, 0.425]}
                      colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                      percent={V2 / 240}
                      arcPadding={0.02}
                      textColor='black'
                      formatTextValue={(value) =>
                        Math.round(value * 2.4 * 100) / 100 + 'V'
                      }
                    />
                  </div>
                )}
                {(!!V3 || V3 === 0) && (
                  <div className='box col-md-2 flex-column'>
                    <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                      Voltaje L3
                    </div>
                    <GaugeChart
                      id='gauge-chart33'
                      nrOfLevels={240}
                      arcsLength={[0.45, 0.125, 0.425]}
                      colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                      percent={V3 / 240}
                      arcPadding={0.02}
                      textColor='black'
                      formatTextValue={(value) =>
                        Math.round(value * 2.4 * 100) / 100 + 'V'
                      }
                    />
                  </div>
                )}
                {(!!V12 || V12 === 0) && (
                  <div className='box col-md-2 flex-column'>
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
                  <div className='box col-md-2 flex-column'>
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
                  <div className='box col-md-2 flex-column'>
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
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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
                <div className="col-md-2">
                  <br/>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center active">
                        % THD Tensión
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        L1
                        <span className="badge badge-primary badge-pill">{THDV1}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        L2
                        <span className="badge badge-primary badge-pill">{THDV2}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                       L3
                        <span className="badge badge-primary badge-pill">{THDV3}</span>
                      </li>
                    </ul>
                  <br/>
                </div>
                <div className="col-md-2">
                  <br/>
                  <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between align-items-center active">
                    % THD Corriente
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    L1
                      <span className="badge badge-primary badge-pill">{THDI1}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    L2
                      <span className="badge badge-primary badge-pill">{THDI2}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    L3
                      <span className="badge badge-primary badge-pill">{THDI3}</span>
                    </li>
                  </ul>
                <br/>
                </div>
                
              </div>
              <div className="row">
              <div className='col-md-2 col-6 flex-column text-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Potencia Activa
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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
                  <br/>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Demanda Máxima
                        <span className="badge badge-primary badge-pill">{MdkWIII} W</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Energía activa total consumida
                        <span className="badge badge-primary badge-pill">{kWhIII} kWh</span>
                      </li>
                    </ul>
                  <br/>
                </div>
                <div className='col-md-2 col-6 flex-column text-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Potencia Reactiva
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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
                <br/>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Demanda Reactiva Consumida
                        <span className="badge badge-primary badge-pill">{MdkvarL + MdkvarC} kvar</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Frecuencia
                        <span className="badge badge-primary badge-pill">{Hz} Hz</span>
                      </li>
                    </ul>
                  <br/>
                </div>
                <div className='col-md-2 col-6 flex-column text-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Potencia Aparente
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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
                <div className='col-md-2 col-6 flex-column text-center'>
                <br/>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Demanda Máxima Aparente Consumida
                        <span className="badge badge-primary badge-pill">{MdkVAIII} kVA</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Factor de Potencia
                        <span className="badge badge-primary badge-pill">{FP}</span>
                      </li>
                    </ul>
                  <br/>
                </div>
              </div> */}
              <div className='row'>
                <div className="col-md-6">
                  <div className="row">
                  {(!!V1 || V1 === 0) && (
                  <div className='box col-md-4 flex-column'>
                    <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                      Voltaje L1
                    </div>
                    <GaugeChart
                      id='gauge-chart11'
                      nrOfLevels={240}
                      arcsLength={[0.45, 0.125, 0.425]}
                      colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                      percent={V1 / 240}
                      arcPadding={0.02}
                      textColor='black'
                      formatTextValue={(value) =>
                        Math.round(value * 2.4 * 100) / 100 + 'V'
                      }
                    />
                  </div>
                )}
                {(!!V2 || V2 === 0) && (
                  <div className='box col-md-4 flex-column'>
                    <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                      Voltaje L2
                    </div>
                    <GaugeChart
                      id='gauge-chart22'
                      nrOfLevels={240}
                      arcsLength={[0.45, 0.125, 0.425]}
                      colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                      percent={V2 / 240}
                      arcPadding={0.02}
                      textColor='black'
                      formatTextValue={(value) =>
                        Math.round(value * 2.4 * 100) / 100 + 'V'
                      }
                    />
                  </div>
                )}
                {(!!V3 || V3 === 0) && (
                  <div className='box col-md-4 flex-column'>
                    <div style={{ paddingTop: '10px', fontWeight: 'bold' }}>
                      Voltaje L3
                    </div>
                    <GaugeChart
                      id='gauge-chart33'
                      nrOfLevels={240}
                      arcsLength={[0.45, 0.125, 0.425]}
                      colors={['rgb(240 165 46)', '#5BE12C', '#EA4228']}
                      percent={V3 / 240}
                      arcPadding={0.02}
                      textColor='black'
                      formatTextValue={(value) =>
                        Math.round(value * 2.4 * 100) / 100 + 'V'
                      }
                    />
                  </div>
                )}
                  </div>
                  <br/>
                  <br/>
                  <div className="row">
                  {(!!V12 || V12 === 0) && (
                  <div className='box col-md-4 flex-column'>
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
                  <div className='box col-md-4 flex-column'>
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
                  <div className='box col-md-4 flex-column'>
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
                  <br/>
                  <br/>
                  <div className="row">
                  <div className='col-md-4 flex-column text-center justify-content-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Corriente L1
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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

                <div className='col-md-4 flex-column text-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Corriente L2
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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
                <div className='col-md-4 flex-column text-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Corriente L3
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
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
                  </div>
                
                </div>
                <div className="col-md-6">
 
                  <div className="row">
                  <div className='col-md-4 flex-column text-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Potencia Activa
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
                    <ResponsiveContainer width={150} height={180}>
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
                  <div className='col-md-4 flex-column text-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Potencia Reactiva
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
                    <ResponsiveContainer width={150} height={180}>
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
                  <div className='col-md-4 flex-column text-center'>
                  <div style={{ paddingBottom: '10px', fontWeight: 'bold' }}>
                    Potencia Aparente
                  </div>
                  <div
                    style={{ display: 'inline-block', paddingRight: '20px' }}
                  >
                    <ResponsiveContainer width={150} height={180}>
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

                <div className="row">
                        <div className="col-md-8">
                          <br/>
                          <br/>
                        <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Demanda Máxima
                        <span className="badge badge-primary badge-pill">{MdkWIII} W</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Demanda Máxima Aparente Consumida
                        <span className="badge badge-primary badge-pill">{MdkVAIII} kVA</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Demanda Reactiva Consumida
                        <span className="badge badge-primary badge-pill">{MdkvarL + MdkvarC} kvar</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Energía activa total consumida
                        <span className="badge badge-primary badge-pill">{kWhIII} kWh</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Factor de Potencia
                        <span className="badge badge-primary badge-pill">{FP}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                      Frecuencia
                        <span className="badge badge-primary badge-pill">{Hz} Hz</span>
                      </li>
                    </ul>
                        </div>
                        <div className="col-md-4">
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center active">
                        % THD Tensión
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        L1
                        <span className="badge badge-primary badge-pill">{THDV1}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        L2
                        <span className="badge badge-primary badge-pill">{THDV2}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                       L3
                        <span className="badge badge-primary badge-pill">{THDV3}</span>
                      </li>
                    </ul>
        
                  <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between align-items-center active">
                    % THD Corriente
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    L1
                      <span className="badge badge-primary badge-pill">{THDI1}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    L2
                      <span className="badge badge-primary badge-pill">{THDI2}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    L3
                      <span className="badge badge-primary badge-pill">{THDI3}</span>
                    </li>
                  </ul>
                </div>
                
                </div>
                </div>
                
               
              </div>
              <br />
              <div className='row'>
              
                
                
                
              </div>
              <div className="row">
              
              
                
                
                <div className='col-md-2 col-6 flex-column text-center'>
                <br/>
                  <br/>
                </div>
              </div>
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
