$(function () {

    /**
     * Experimental Highcharts plugin to implement chart.alignThreshold option. This primary axis
     * will be computed first, then all following axes will be aligned to the threshold.
     * Author: Torstein Hønsi
     * Last revision: 2015-05-16
     */
    (function (H) {
        var Axis = H.Axis,
            inArray = HighchartsAdapter.inArray,
            wrap = H.wrap;

        wrap(Axis.prototype, 'adjustTickAmount', function (proceed) {
            var chart = this.chart,
                primaryAxis = chart[this.coll][0],
                primaryThreshold,
                primaryIndex,
                index,
                newTickPos,
                threshold,
                axis = this,
                getIndex = function () {
                    return inArray(threshold, axis.tickPositions);
                };

            if (chart.options.chart.alignThresholds && this !== primaryAxis) {
                primaryThreshold = (primaryAxis.series[0] && primaryAxis.series[0].options.threshold) || 0;
                threshold = (this.series[0] && this.series[0].options.threshold) || 0;

                primaryIndex = primaryAxis.tickPositions && inArray(primaryThreshold, primaryAxis.tickPositions);

                if (this.tickPositions) {
                    // Add tick positions to the top or bottom in order to align the threshold
                    // to the primary axis threshold
                    index = getIndex();
                    while (this.tickPositions.length !== this.tickAmount || index !== primaryIndex) {
                        if (index < primaryIndex) {
                            newTickPos = this.tickPositions[0] - this.tickInterval;
                            this.tickPositions.unshift(newTickPos);
                            this.min = newTickPos;
                        } else {
                            newTickPos = this.tickPositions[this.tickPositions.length - 1] + this.tickInterval;
                            this.tickPositions.push(newTickPos);
                            this.max = newTickPos;
                        }
                        proceed.call(this);
                        index = getIndex();
                    }
                }

            } else {
                proceed.call(this);
            }
        });
    }(Highcharts));

    $('#container').highcharts({
        chart: {
            alignThresholds: true,
            type: 'area'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: [{
            title: {
                text: 'Primary Axis'
            },
            gridLineWidth: 0
        }, {
            title: {
                text: 'Secondary Axis'
            },
            opposite: true
        }],
        series: [{
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4],
            yAxis: 0
        }, {
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
            yAxis: 1
        }]
    });
});