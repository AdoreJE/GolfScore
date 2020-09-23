#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_SALES1_CA=${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/ca.crt
export PEER0_CUSTOMER_CA=${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/ca.crt

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  export CORE_PEER_LOCALMSPID="OrdererMSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  echo "Using organization ${USING_ORG}"
  if [ $USING_ORG == 'sales1' ]; then
    export CORE_PEER_LOCALMSPID="Sales1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_SALES1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/sales1.example.com/users/Admin@sales1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
  elif [ $USING_ORG == 'customer' ]; then
    export CORE_PEER_LOCALMSPID="CustomerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_CUSTOMER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/customer.example.com/users/Admin@customer.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
  else
    echo "================== ERROR !!! ORG Unknown =================="
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {

  PEER_CONN_PARMS=""
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    PEER="peer0.$1"
    ## Set peer adresses
    PEERS="$PEERS $PEER"
    PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
    ## Set path to TLS certificate
    if [ $1 == 'sales1' ]; then
      TLSINFO=$(eval echo "--tlsRootCertFiles \$PEER0_SALES1_CA")
    elif [ $1 == 'customer' ]; then
      TLSINFO=$(eval echo "--tlsRootCertFiles \$PEER0_CUSTOMER_CA")
    fi
    PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    # shift by one to get to the next organization
    shift
  done
  # remove leading space for output
  PEERS="$(echo -e "$PEERS" | sed -e 's/^[[:space:]]*//')"
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo $'\e[1;31m'!!!!!!!!!!!!!!! $2 !!!!!!!!!!!!!!!!$'\e[0m'
    echo
    exit 1
  fi
}