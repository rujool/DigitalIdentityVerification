#!/bin/sh
~/fabric-tools/startFabric.sh
composer network install --card PeerAdmin@hlfv1 --archiveFile digital-identity-network@0.0.1.bna
composer network start --networkName digital-identity-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
