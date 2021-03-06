

function createSales1 {

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p organizations/peerOrganizations/sales1.example.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/sales1.example.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-sales1 --tls.certfiles ${PWD}/organizations/fabric-ca/sales1/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-sales1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-sales1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-sales1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-sales1.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/sales1.example.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-sales1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/sales1/tls-cert.pem
  set +x

  echo
  echo "Register user"
  echo
  set -x
  fabric-ca-client register --caname ca-sales1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/sales1/tls-cert.pem
  set +x

  echo
  echo "Register the org admin"
  echo
  set -x
  fabric-ca-client register --caname ca-sales1 --id.name sales1admin --id.secret sales1adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/sales1/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/sales1.example.com/peers
  mkdir -p organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com

  echo
  echo "## Generate the peer0 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-sales1 -M ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/msp --csr.hosts peer0.sales1.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/sales1/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-sales1 -M ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls --enrollment.profile tls --csr.hosts peer0.sales1.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/sales1/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/sales1.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/sales1.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/sales1.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/sales1.example.com/tlsca/tlsca.sales1.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/sales1.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/peers/peer0.sales1.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/sales1.example.com/ca/ca.sales1.example.com-cert.pem

  mkdir -p organizations/peerOrganizations/sales1.example.com/users
  mkdir -p organizations/peerOrganizations/sales1.example.com/users/User1@sales1.example.com

  echo
  echo "## Generate the user msp"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-sales1 -M ${PWD}/organizations/peerOrganizations/sales1.example.com/users/User1@sales1.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/sales1/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/sales1.example.com/users/User1@sales1.example.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/sales1.example.com/users/Admin@sales1.example.com

  echo
  echo "## Generate the org admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://sales1admin:sales1adminpw@localhost:7054 --caname ca-sales1 -M ${PWD}/organizations/peerOrganizations/sales1.example.com/users/Admin@sales1.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/sales1/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/sales1.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/sales1.example.com/users/Admin@sales1.example.com/msp/config.yaml

}


function createCustomer {

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p organizations/peerOrganizations/customer.example.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/customer.example.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-customer --tls.certfiles ${PWD}/organizations/fabric-ca/customer/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-customer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-customer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-customer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-customer.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/customer.example.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-customer --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/customer/tls-cert.pem
  set +x

  echo
  echo "Register user"
  echo
  set -x
  fabric-ca-client register --caname ca-customer --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/customer/tls-cert.pem
  set +x

  echo
  echo "Register the org admin"
  echo
  set -x
  fabric-ca-client register --caname ca-customer --id.name customeradmin --id.secret customeradminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/customer/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/customer.example.com/peers
  mkdir -p organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com

  echo
  echo "## Generate the peer0 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-customer -M ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/msp --csr.hosts peer0.customer.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/customer/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/customer.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-customer -M ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls --enrollment.profile tls --csr.hosts peer0.customer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/customer/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/customer.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/customer.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/customer.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/customer.example.com/tlsca/tlsca.customer.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/customer.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/customer.example.com/ca/ca.customer.example.com-cert.pem

  mkdir -p organizations/peerOrganizations/customer.example.com/users
  mkdir -p organizations/peerOrganizations/customer.example.com/users/User1@customer.example.com

  echo
  echo "## Generate the user msp"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-customer -M ${PWD}/organizations/peerOrganizations/customer.example.com/users/User1@customer.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/customer/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/customer.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/customer.example.com/users/User1@customer.example.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/customer.example.com/users/Admin@customer.example.com

  echo
  echo "## Generate the org admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://customeradmin:customeradminpw@localhost:8054 --caname ca-customer -M ${PWD}/organizations/peerOrganizations/customer.example.com/users/Admin@customer.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/customer/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/customer.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/customer.example.com/users/Admin@customer.example.com/msp/config.yaml

}

function createOrderer {

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p organizations/ordererOrganizations/example.com

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/example.com
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml


  echo
	echo "Register raft1"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name raft1 --id.secret raft1pw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
    set +x

  echo
	echo "Register raft2"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name raft2 --id.secret raft2pw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
    set +x

  echo
	echo "Register raft3"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name raft3 --id.secret raft3pw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo
  echo "Register the orderer admin"
  echo
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

	mkdir -p organizations/ordererOrganizations/example.com/orderers
  mkdir -p organizations/ordererOrganizations/example.com/orderers/raft1.example.com
  mkdir -p organizations/ordererOrganizations/example.com/orderers/raft2.example.com
  mkdir -p organizations/ordererOrganizations/example.com/orderers/raft3.example.com

  # mkdir -p organizations/ordererOrganizations/example.com/orderers/orderer.example.com

  echo
  echo "## Generate the raft1 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://raft1:raft1pw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/msp --csr.hosts raft1.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/msp/config.yaml

  echo
  echo "## Generate the raft2 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://raft2:raft2pw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/msp --csr.hosts raft2.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/msp/config.yaml

  echo
  echo "## Generate the raft3 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://raft3:raft3pw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/msp --csr.hosts raft3.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/msp/config.yaml

  echo
  echo "## Generate the raft1-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://raft1:raft1pw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls --enrollment.profile tls --csr.hosts raft1.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft1.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  echo
  echo "## Generate the raft2-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://raft2:raft2pw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls --enrollment.profile tls --csr.hosts raft2.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft2.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  echo
  echo "## Generate the raft3-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://raft3:raft3pw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls --enrollment.profile tls --csr.hosts raft3.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/raft3.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p organizations/ordererOrganizations/example.com/users 
  mkdir -p organizations/ordererOrganizations/example.com/users/Admin@example.com

  echo
  echo "## Generate the admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp/config.yaml


}
