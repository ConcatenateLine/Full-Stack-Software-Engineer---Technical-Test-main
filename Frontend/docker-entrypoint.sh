#!/bin/bash
# Add host.docker.internal to hosts if not present
HOST_DOMAIN="host.docker.internal"
if ! grep -q "$HOST_DOMAIN" /etc/hosts; then
    DOCKER_HOST_IP=$(ip route show | awk '/default/ { print $3 }')
    echo -e "$DOCKER_HOST_IP\t$HOST_DOMAIN" >> /etc/hosts
fi

exec "$@"