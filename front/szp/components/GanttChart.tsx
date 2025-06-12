import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const GanttWebView = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://unpkg.com/frappe-gantt/dist/frappe-gantt.css">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          svg { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="gantt"></div>
        <script src="https://unpkg.com/frappe-gantt/dist/frappe-gantt.min.js"></script>
        <script>
          const tasks = [
            {
              id: 'Task 1',
              name: 'Planowanie',
              start: '2024-06-01',
              end: '2024-06-05',
              progress: 20,
            },
            {
              id: 'Task 2',
              name: 'Wykonanie',
              start: '2024-06-06',
              end: '2024-06-15',
              progress: 60,
            },
            {
              id: 'Task 3',
              name: 'Testy',
              start: '2024-06-16',
              end: '2024-06-20',
              progress: 10,
            }
          ];
          const gantt = new Gantt("#gantt", tasks);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default GanttWebView;