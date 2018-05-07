#!/bin/sh
~/fabric-tools/startFabric.sh
composer network install --card PeerAdmin@hlfv1 --archiveFile digital-identity-network@0.0.4.bna
