#!/bin/sh
set -e

t1="/usr/share/nginx/html/neodash_secret.txt"
if [ ! -s "$t1" ]; then
  t2=$(LC_ALL=C tr -dc A-Za-z0-9 < /dev/urandom | head -c 16)
  echo "$t2" > "$t1"
else
  t2=$(cat "$t1")
fi

t3="${standalonePassword:=}|${t2}"

t4=$(cat <<EOF
{
    "ssoEnabled": ${ssoEnabled:=false},
    "ssoProviders": ${ssoProviders:=[]},
    "ssoDiscoveryUrl": "${ssoDiscoveryUrl:='https://example.com'}",
    "standalone": ${standalone:=false},
    "standaloneProtocol": "${standaloneProtocol:='neo4j+s'}",
    "standaloneHost": "${standaloneHost:='test.databases.neo4j.io'}",
    "standalonePort": ${standalonePort:=7687},
    "standaloneDatabase": "${standaloneDatabase:='neo4j'}",
    "standaloneUsername": "${standaloneUsername:=}",
    "standalonePassword": "${t3}",
    "standaloneDashboardName": "${standaloneDashboardName:='My Dashboard'}",
    "standaloneDashboardDatabase": "${standaloneDashboardDatabase:='neo4j'}",
    "standaloneDashboardURL": "${standaloneDashboardURL:=}",
    "skipConfirmation": "${skipConfirmation:=true}",
    "skipAddDashErrorPopup": "${skipAddDashErrorPopup:=true}"
}
EOF
)

t5=$(echo "$t4" | base64 | tr -d '\n')
echo "{ \"data\": \"$t5\" }" > /usr/share/nginx/html/config.json