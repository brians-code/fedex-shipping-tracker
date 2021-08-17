import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import JSONPretty from 'react-json-pretty'

interface TrackingCode {
  id: number,
  label_id: string,
  shipping_tracking_code: string,
}

export default function App() {
  
  const [trackingCodes, setTrackingCodes] = useState<TrackingCode[]>([])
  const [searchString, setsearchString] = useState<string>('')
  const [trackingCode, setTrackingCode] = useState<string>('')
  const [shippingHistory, setShippingHistory] = useState<any>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  
  useEffect(() => {
    if(searchString && searchString.length > 2) {
      setLoading(true)
      fetch('http://3.86.33.199:3000/tracking-codes?q=' + searchString)
        .then(response => response.json())
        .then(data => {
          setTrackingCodes(data)
          setLoading(false)
        })
    } else {
      setTrackingCodes([])
    }
  }, [searchString])
  
  useEffect(() => {
    if(trackingCode) {
      setLoading(true)
      fetch('http://3.86.33.199:3001/track/' + trackingCode)
        .then(response => response.json())
        .then(data => {
          setShippingHistory(data)
          setLoading(false)
        })
    }
  }, [trackingCode])
  
  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Autocomplete
            id='tracking-code'
            options={trackingCodes}
            getOptionLabel={(option) => searchString.includes('-') ? option.label_id : option.shipping_tracking_code }
            style={{ width: 300, margin: '40px' }}
            loading={loading}
            clearOnBlur={false}
            filterOptions={(options) => trackingCodes.filter(code => code.shipping_tracking_code.startsWith(searchString) || code.label_id.startsWith(searchString))}
            noOptionsText={searchString.length > 2 ? 'No matches' : 'Keep typing...'}
            onChange={(e, value, reason) => value && reason==='select-option' ? setTrackingCode(value.shipping_tracking_code) : setTrackingCode('') }
            renderInput={(params) => (
              <TextField
                {...params}
                label='FedEx Tracking Code or Kit ID'
                variant='outlined'
                onChange={(e) => setsearchString(e.currentTarget.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color='inherit' size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />          
          <CardContent>
            <div style={{ margin: '0px 20px 40px 20px' }}>
              You can enter a FedEx shipping code or kit label ID in order to check its shipping status.<br /><br />
              
              The simple fedex-tracker service I built connects to the FedEx sandbox. The response renders in pure JSON below. Look for the TrackDetails element to see the important details.<br /><br />
              
              The 1000 tracking codes in the JSON file you provided will all return a message saying "This tracking number cannot be found". So I added some special kit IDs that start with 'zz-'. They each have a shipping code that will return mock shipping data from the FedEx sandbox. Start typing 'zz-' into the search box to try it out.
            </div>
            {shippingHistory && 
              <Card style={{ background: 'azure' }}>
                <CardContent>
                  <JSONPretty id="json-pretty" data={shippingHistory}></JSONPretty>
                </CardContent>
              </Card>
            }
          </CardContent>
        </CardContent>
      </Card>
    </Container>
  )
}
