import { EndpointTypes } from "../../Helpers/EndpointTypes";
import { TimeSpanInput } from "./TimeSpanInput";

export const getQueueCrudProperties = () => {
    const queue = EndpointTypes.QUEUE;
    return {
        readonly: [
            new PropertyConfig('activeMessageCount'),
            new PropertyConfig('deadletterMessageCount'),
            new PropertyConfig('mostRecentDeadletter'),
        ],
        setAtCreation: [
            new PropertyConfig('enablePartitioning'),
            new PropertyConfig('requiresSession').WithCommonTooltip(queue),
            new PropertyConfig('requiresDuplicateDetection'),
        ],
        editable: [
            new PropertyConfig('supportOrdering'),
            new PropertyConfig('autoDeleteOnIdle').WithCommonTooltip(queue).WithCustomInput(TimeSpanInput),
            new PropertyConfig('enableDeadletteringOnMessageExpiration').WithCommonTooltip(queue),
            new PropertyConfig('maxDeliveryCount').WithCommonTooltip(queue),
            new PropertyConfig('maxSizeInMegabytes'),
            new PropertyConfig('status').WithDropdown(getStatusDropdownOptions()),
        ]
    };
};

export const getSubscriptionCrudProperties = () => {
    const sub = EndpointTypes.SUBSCRIPTION;
    return {
        readonly: [
            new PropertyConfig('topicName'),
            new PropertyConfig('activeMessageCount'),
            new PropertyConfig('deadletterMessageCount'),
            new PropertyConfig('mostRecentDeadletter'),
        ],
        setAtCreation: [
            new PropertyConfig('requiresSession').WithCommonTooltip(sub),
        ],
        editable: [
            new PropertyConfig('autoDeleteOnIdle').WithCommonTooltip(sub).WithCustomInput(TimeSpanInput),
            new PropertyConfig('enableDeadletteringOnMessageExpiration').WithCommonTooltip(sub),
            new PropertyConfig('maxDeliveryCount').WithCommonTooltip(sub),
            new PropertyConfig('subscriptionStatus').WithDropdown(getStatusDropdownOptions()),
        ]
    };
};

export const getTopicCrudProperties = () => {
    const topic = EndpointTypes.TOPIC;
    return {
        readonly: [
            new PropertyConfig('subscriptionCount'),
        ],
        setAtCreation: [
            new PropertyConfig('requiresDuplicateDetection'),
            new PropertyConfig('enablePartitioning'),
        ],
        editable: [
            new PropertyConfig('supportOrdering'),
            new PropertyConfig('autoDeleteOnIdle').WithCommonTooltip(topic).WithCustomInput(TimeSpanInput),
            new PropertyConfig('maxSizeInMegabytes'),
            new PropertyConfig('topicStatus').WithDropdown(getStatusDropdownOptions()),
        ]
    };
};

class PropertyConfig {
    constructor(propertyName, displayLabel) {
        this.propertyName = propertyName;
        this.displayLabel = displayLabel || propertyName.charAt(0).toUpperCase() + propertyName.substr(1);
    }

    WithCommonTooltip = (endpointType) => {
        this.tooltipText = commonTooltipText(this.propertyName, endpointType);
        return this;
    }

    WithCustomTooltip = (tooltipText) => {
        this.tooltipText = tooltipText;
        return this;
    }

    WithDropdown = (dropdownOptions) => {
        this.dropdownValues = dropdownOptions;
        return this;
    }

    WithCustomInput = (inputComponent) => {
        this.component = inputComponent;
        return this;
    }
}

function commonTooltipText(field, endpointType) {
    const texts = {
        requiresSession:
            `True if the receiver application can only receive from the ${endpointType} through a MessageSession; false if a ${endpointType} cannot receive using MessageSession.`,
        autoDeleteOnIdle:
            `The idle time span after which the ${endpointType} is automatically deleted. The minimum duration is 5 minutes.`,
        maxDeliveryCount:
            'A message is automatically deadlettered after this number of deliveries.',
        enableDeadletteringOnMessageExpiration:
            `Sets whether this ${endpointType} has dead letter support when a message expires.`
    };
    return texts[field];
}

/**
 * @returns {Object <string, {label: string, value: any}>[]} Object for dropdown of possible EndpointStatuses.
 */
function getStatusDropdownOptions() {
    return getDropdownOptions(['Active', 'Disabled']);
}

/**
 * @param {string[]} textValues Possible strings to select.
 * @returns {Object <string, {label: string, value: any}>[]} Maps from property name to permitted dropdown options where required.
 */
function getDropdownOptions(textValues) {
    return textValues.map(text => { return { label: text, value: text }; });
}
