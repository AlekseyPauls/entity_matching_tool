import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup  from 'react-bootstrap/lib/PanelGroup';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
import { browserHistory } from 'react-router';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import axios from 'axios';
    
    
class ListJobs extends Component {

    constructor(props) {
        super();
        this.state = {
            activeKey: '1',
            listJobs: null,
            url: localStorage.getItem('loginToken') ? 'http://' + localStorage.getItem('loginToken') + ':@0.0.0.0:5000' : null
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
    };

    componentWillMount() {
        if(localStorage.getItem('loginToken')){
            this.getListJob();
        }
    };

    getListJob() {
        let self = this;
        axios.get(this.state.url + '/joblist/')
                .then(function(response) {
                    self.setState({
                        listJobs: response.data != null ?
                                    response.data
                                        .map((job) => 
                                            <Panel key={job.id} header={job.name} eventKey={job.id}>
                                                {"Status"}
                                                <ProgressBar now={job.status} label={`${job.status}%`} />

                                                {"Source 1"}
                                                <Well bsSize='sm'>
                                                    {job.source1}
                                                </Well>
                                                {"Selected field"}
                                                <Well bsSize='sm'>
                                                    {job.selectedFields.source1}
                                                </Well>
                                            
                                                {"Source 2"}
                                                <Well bsSize='sm'>
                                                    {job.source2}
                                                </Well>

                                                {"Selected field"}
                                                <Well bsSize='sm'>
                                                    {job.selectedFields.source2}
                                                </Well>
                                                {"SelectedMetric"}
                                                <Well bsSize='sm'>
                                                    {job.metric}
                                                </Well>
                                                <ButtonToolbar>
                                                    <Button onClick={() => browserHistory.push('/options/' + job.id)}> Matching options </Button>
                                                    <Button bsStyle="danger" onClick={() => self.deleteJob(job.id)}> Delete job </Button>
                                                </ButtonToolbar>
                                            </Panel>
                                        ) 
                                    : null
                    });
                });
    }

    deleteJob(id) {
        let self = this;
        axios.delete(this.state.url + '/jobs/?jobId=' + id)
            .then(function(response) {
                self.getListJob();
            })
    }

    

    handleSelect(activeKey) {
        this.state.activeKey === activeKey ? 
            this.setState({ activeKey: null}) : this.setState({ activeKey: activeKey });
    };

    render() {
        return (
            <PanelGroup id={this.props.callback} activeKey={this.state.activeKey} 
                onSelect={this.handleSelect} accordion>
                {this.state.listJobs}
            </PanelGroup>
        );
    };
};

export default ListJobs;