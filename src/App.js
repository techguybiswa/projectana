import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import { Card, Col, Row, Timeline } from 'antd';
import { Button, notification } from 'antd';
import { Spin, Space } from 'antd';

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Statistic } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import {
  AreaChart, Area,
} from 'recharts';
import { Input } from 'antd';

const { Header, Content, Footer } = Layout;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFileUploaded: false,
      totalNumberOfMessages: 0,
      totalNumberOfwords: 0,
      mapOfNames: {},
      mapOfDates: {},
      mapOfWordCount: {},
      mapOfWordCloud: {},
      numberPerUserData: [],
      countPerDate: [],
      wordCloudList: [],
      filteredWordCloud: [],
      searchBox : "",
      loadingText: ""
    }
  }
  componentDidMount = () => {
    this.openNotification()
    
  }

  showFile = async (e) => {

    e.preventDefault()
    this.setState({
      loadingText: "Generating visualizations..."
    })
    const reader = new FileReader()
    reader.onload = async (e) => {

      const allMessage = (e.target.result)
      console.log(allMessage.replace(/\r/g, "").split(/\n/))
      let formattedMessages = allMessage.replace(/\r/g, "").split(/\n/)
      // console.log("total length ", formattedMessages.length)
      this.fetchAllUniqueNames(formattedMessages)
      // console.log(allMessage.replace(/\r/g, "").split(/\n/).length)
    };
    reader.readAsText(e.target.files[0])
  }

   openNotification = () => {
    notification.open({
      message: 'Your data is SAFE and is WITH YOU ONLY',
      description:
        'This app works 100% offline. We do not send ANY data to backend and is a fully client JS based web app. Source code is also open sourced.',
      className: 'custom-class',
      style: {
        width: 600,
      },
    });
  };

  fetchAllUniqueNames = (allMessage) => {
    console.log("INSIDE FAUN")
    this.setState({
      isFileUploaded: true

    })
    let mapOfNames = {}
    let mapOfDates = {}
    let mapOfWordCount = {}
    let wordCloud = {}
    let totalNumberOfwords = 0;
    let sum = 0;
    for (let i = 0; i < allMessage.length; i++) {
      let firstIndex = allMessage[i].indexOf(" - ")
      let lastIndex = allMessage[i].indexOf(": ")
      let indexOfComma = allMessage[i].indexOf(",")
      if (firstIndex < lastIndex) {
        let name = allMessage[i].slice(firstIndex, lastIndex)
        let date = allMessage[i].slice(0, indexOfComma)
        let dateValidationRegex = "^[0-9a-zA-Z/ -]+$"
        let tmpDate = new Date(date)
        let isDateValid = date.match(dateValidationRegex)

        let eachWordList = allMessage[i].slice(lastIndex, allMessage[i].length).split(" ");
        let validWords = eachWordList.filter(eachWord => {
          let isValid = eachWord.match(".*[a-zA-Z]+.*")
          if (eachWord == "<Media" || eachWord == "omitted>") {
            isValid = false
          }
          return isValid
        })
        totalNumberOfwords += validWords.length
        // console.log("VW " , validWords)
        validWords.map(eachWord => {
          eachWord = eachWord.replace(/[^a-zA-Z0-9]/g, '');
          if (eachWord in wordCloud) {
            wordCloud[eachWord] += 1
          } else {
            wordCloud[eachWord] = 1
          }
        })
        // if(wordCount) {
        //   if(name in mapOfWordCount) {
        //     mapOfWordCount[name] += wordCount;
        //   }else { 
        //     mapOfWordCount[name] = wordCount
        //   }
        // }
        if (tmpDate == "Invalid Date") {
          isDateValid = false
        }
        if (date.length && isDateValid) {
          if (date in mapOfDates) {
            mapOfDates[date] += 1;
          } else {
            mapOfDates[date] = 1;
          }
        }
        // console.log(name)
        if (name.length) {
          if (name in mapOfNames) {
            mapOfNames[name] += 1;
          } else {
            mapOfNames[name] = 1

          }
        }
      }
    }
    Object.keys(mapOfNames).map(eachName => {
      let text = eachName;
      if (text.indexOf("changed the subject from") != -1 || text.indexOf("created group") != -1) {
        delete mapOfNames[eachName]
      } else {
        sum += mapOfNames[eachName];
      }
    })
    // console.log(mapOfNames)
    // console.log(mapOfDates)
    console.log("mapOfWordCount , ", mapOfWordCount)
    // console.log("wordCloud " , wordCloud)
    console.log("SUM ", sum)
    this.generateWordCloud(wordCloud)
    this.generateNumberPerUserData(mapOfNames)
    this.generateNumberPerDate(mapOfDates)
    this.setState({
      totalNumberOfMessages: sum,
      mapOfDates,
      mapOfNames,
      totalNumberOfwords

    })



  }
  generateWordCloud = (wordCloud) => {
    let wordCloudList = [];
    Object.keys(wordCloud).map(eachWord => {

      let objValue = {
        'word': eachWord,
        'freq': wordCloud[eachWord]
      }
      wordCloudList.push(objValue)
    })


    wordCloudList = wordCloudList.sort(function (a, b) {
      return b.freq - a.freq;
    });
    console.log("wordCloudList ", wordCloudList)
    this.setState({ wordCloudList, filteredWordCloud:  wordCloudList})
  }
  generateNumberPerDate = (mapOfDates) => {
    let countPerDate = []
    Object.keys(mapOfDates).map(eachDate => {

      let eachObj = {
        'date': eachDate,
        'count': mapOfDates[eachDate]
      }
      countPerDate.push(eachObj)
    })

    this.setState({ countPerDate })

  }

  generateNumberPerUserData = (mapOfNames) => {
    let numberPerUserData = [];
    Object.keys(mapOfNames).map(eachName => {
      let eachObj = {
        'name': eachName,
        'numberOfMessages': mapOfNames[eachName]
      }
      numberPerUserData.push(eachObj)
    })

    numberPerUserData = numberPerUserData.sort(function (a, b) {
      return b.numberOfMessages - a.numberOfMessages;
    });
    console.log("numberPerUserData ", numberPerUserData)
    // numberPerUserData = numberPerUserData.slice(0, 10)

    this.setState({ numberPerUserData })
  }

filterWordCloud = (event) => {
  console.log(event.target.value);
  let searchTerm = event.target.value
  let filteredWordCloud = this.state.wordCloudList.filter(eachWord => eachWord.word.includes(searchTerm))
  this.setState({
    filteredWordCloud
  })
}
  render = () => {

    return (<div>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Project Ana</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ margin: '50px', padding: "50px", backgroundColor: "white" ,  }}>
          {!this.state.isFileUploaded && (
            <Row>
              <Col span="8">
                <Card title="How to use whats app analyzer (or Watch the video)" style={{ width: "90%" }}>
                  <p><b>Step 1:</b> Open a whats app chat and click on the 3 dots on top right</p>
                  <p><b>Step 2:</b> Click on "More"</p>
                  <p><b>Step 3:</b> Click on "Export Chat"</p>
                  <p><b>Step 4:</b> Click on "WITHOUT MEDIA". You will see an "Initializing" page. Wait for a few seconds.</p>
                  <p><b>Step 5:</b> Send the exported chat via email to your mail.</p>
                  <p><b>Step 6:</b> Download the exported chat as TXT from your email in your computer and upload here.</p>
                </Card>

              </Col>
              <Col span="8">

                <iframe width="90%" height="600" src="https://www.youtube.com/embed/0B7vD1Ys17Y" frameborder="10" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </Col>

              <Col span="8">
                <Button onClick={this.openNotification}>Is my data private? </Button>
                <br/>
                <h2 >Upload your Whats App Text file <input type="file" onChange={(e) => this.showFile(e)} /></h2>
          <h2>{this.state.loadingText}</h2>
              </Col>
            </Row>
          )}

          {
            this.state.isFileUploaded && this.state.numberPerUserData && (
              <div>
                <div style={{ width: '100%', height: 400 }}>
                <h1><b>Number of messages per people sorted in descending order</b></h1>

                  <ResponsiveContainer>
                    <BarChart
                      width={1000}
                      height={400}
                      data={this.state.numberPerUserData}
                      margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="numberOfMessages" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <Row >
                  <Col span={8}></Col>
                  <Col span={8} style={{ paddingTop: "70px" }}>
                  <h1><b>Fun Facts and Insights from the chat</b></h1>
                      <br/>
                    <Timeline>
                      <Timeline.Item>Wohoo! 🥳🎉🎉🎉 Our <b>messenger</b> topper is : {this.state.numberPerUserData.length ? this.state.numberPerUserData[0].name : ""}  with {this.state.numberPerUserData.length ? this.state.numberPerUserData[0].numberOfMessages : ""} messages! </Timeline.Item>
                      <Timeline.Item>You guys/girls 👨👧 sent out {this.state.totalNumberOfMessages} messages all total.  </Timeline.Item>
                      <Timeline.Item>Great! 🤩 You all have interacted for {this.state.countPerDate.length ? this.state.countPerDate.length : ""} days between {this.state.countPerDate.length ? this.state.countPerDate[0].date : ""} and {this.state.countPerDate.length ? this.state.countPerDate[this.state.countPerDate.length - 1].date : ""}!  </Timeline.Item>
                      <Timeline.Item>On an average you all wrote {this.state.countPerDate.length ? (this.state.totalNumberOfwords / this.state.countPerDate.length).toFixed(2) : ""} words a day! 🤗🤗🤗</Timeline.Item>
                      <Timeline.Item>In total you all wrote  {this.state.totalNumberOfwords} words and have spent approximately {((this.state.totalNumberOfwords * (1 / 29)) / 60).toFixed(2)} hrs on texting with this group/friend.</Timeline.Item>

                    </Timeline>
                  </Col>

                </Row>

                <div style={{ width: '100%', height: 400 }}>
                <h1><b>Messages over the duration on per day basis</b></h1>

                  <ResponsiveContainer>

                    <AreaChart
                      data={this.state.countPerDate}
                      margin={{
                        top: 10, right: 30, left: 0, bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                      <br/>
                      <br/>

                      <br/>
                      <h1><b>Sorted list of words based on frequency of use!</b></h1>
 <br/>
                <Input placeholder="Word Cloud Search..." onChange={(event) => this.filterWordCloud(event)}/>
                 <div style={{ display: "flex", flexWrap: "wrap", height: "500px", overflowY: "scroll" , overflowX: "hidden" , marginTop: "20px"}}>
                    {
                      this.state.filteredWordCloud.map( (eachWord, index) => (
                      <div style={{backgroundColor: "#f1f1f1" , width: "100px" , height: "80px", textAlign: "center" , margin: "10px"}}> <b> Rank- {index+1}</b> {eachWord.word} occured {eachWord.freq} times</div>

                      ))
                    }




                  </div>
              </div>
            )
          }

        </Content>
        <Footer style={{ textAlign: 'center' }}> <a href="https://www.linkedin.com/in/techguybiswa/">@techguybiswa</a> ©2020 Created by  <a href="https://www.linkedin.com/in/techguybiswa/">Biswarup Banerjee</a> 🌻🌻🌻
</Footer>
      </Layout>
    </div>
    )
  }
}

export default App;