export function translate(locale: string = 'en') {
  return {
    commands: {
      ping: {
        data: {
          name: () => 'ping',
          description: () => 'Check bot latency',
        },
        command: {
          embeds: [
            { title: () => 'Pinging...' },
            {
              title: () => '❌ Failed',
              description: () => 'Could not fetch response in time.',
            },
            {
              title: () => '🏓 Pong!',
              fields: [
                { name: () => 'WebSocket Ping', value: ({ ms }: any) => `${ms}ms` },
                { name: () => 'Latency', value: ({ ms }: any) => `${ms}ms` },
                { name: () => 'Status', value: ({ status }: any) => status },
              ],
            },
          ],
        },
      },
    },
  };
}

export function getTranslations(_key: string) {
  return {}; // Stub until you build dynamic localization
}
