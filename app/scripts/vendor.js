// APP wide dependencies only, load as needed otherwise
var exoskeleton = require('../../vendor/exoskeleton'),
    react = require('react'),
    reactBackbone = require('../../vendor/react.backbone'),
    lodash = require('../../vendor/lodash.custom.min'),
    scouter = require('../../vendor/scouter'),
    jqueryui = require('../../vendor/jquery-ui.min');

module.exports = {
    exoskeleton: exoskeleton,
    react: react,
    lodash: lodash,
    scouter: scouter,
    jqueryui: jqueryui
}