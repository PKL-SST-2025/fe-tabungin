import { Component, onMount, onCleanup } from 'solid-js';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface ChartData {
  date: string;
  value: number;
}

interface SavingsChartProps {
  data?: ChartData[];
  period: string;
}

const SavingsChart: Component<SavingsChartProps> = (props) => {
  let chartDiv: HTMLDivElement | undefined;
  let root: am5.Root | undefined;

  // Default data based on period
  const getDefaultData = (): ChartData[] => {
    const today = new Date();
    const data: ChartData[] = [];
    
    if (props.period === '2 Hari Terakhir') {
      for (let i = 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 100000) + 50000
        });
      }
    } else if (props.period === '7 Hari Terakhir') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 150000) + 75000
        });
      }
    } else if (props.period === '30 Hari Terakhir') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 200000) + 100000
        });
      }
    }
    
    return data;
  };

  onMount(() => {
    if (!chartDiv) return;

    // Create root element
    root = am5.Root.new(chartDiv);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        paddingRight: 1
      })
    );

    // Add cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(root, { 
      minGridDistance: 30,
      minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });

    xRenderer.grid.template.setAll({
      location: 1
    });

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxZoomCount: 1000,
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1
        })
      })
    );

    // Create series
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Tabungan",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        legendValueText: "Rp {valueY}",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "Tanggal: {valueX.formatDate()}\nJumlah: Rp {valueY.formatNumber('#,###')}"
        })
      })
    );

    // Set line stroke
    series.strokes.template.setAll({
      strokeWidth: 3,
      stroke: am5.color("#10b981") // Green color
    });

    // Add gradient fill
    series.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true,
      fill: am5.color("#10b981")
    });

    // Set bullet
    series.bullets.push(function () {
      const bulletCircle = am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill"),
        stroke: am5.color("#ffffff"),
        strokeWidth: 2
      });
      return am5.Bullet.new(root, {
        sprite: bulletCircle
      });
    });

    // Get data
    const chartData = props.data || getDefaultData();
    
    // Transform data for amCharts
    const transformedData = chartData.map(item => ({
      date: new Date(item.date).getTime(),
      value: item.value
    }));

    // Set data
    series.data.setAll(transformedData);

    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);
  });

  onCleanup(() => {
    if (root) {
      root.dispose();
    }
  });

  return (
    <div 
      ref={chartDiv} 
      class="w-full h-80"
      style={{ width: '100%', height: '320px' }}
    />
  );
};

export default SavingsChart;
