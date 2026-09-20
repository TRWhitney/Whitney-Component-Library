export function createOperationalProofSource() {
  return `
const packedProcessStatusLabels = {
  active: 'Active',
  complete: 'Complete',
  failed: 'Failed',
  pending: 'Pending',
  warning: 'Needs review',
};

function PackedOperationalProof() {
  const configurationForm = React.useRef(null);
  const [operationName, setOperationName] = React.useState('');
  const [operationState, setOperationState] = React.useState('configure');
  const isInvalid = operationState === 'invalid';
  const isValidated = operationState === 'validated';
  const isReviewed = operationState === 'reviewed';
  const isMonitoring = operationState === 'monitoring';
  const stages = isMonitoring
    ? [
        {id: 'configure', label: 'Configuration', status: 'complete'},
        {id: 'review', label: 'Review', status: 'complete'},
        {id: 'execute', label: 'Solve', status: 'active'},
      ]
    : isReviewed || isValidated
      ? [
          {id: 'configure', label: 'Configuration', status: 'complete'},
          {
            id: 'review',
            label: 'Review',
            status: isReviewed ? 'complete' : 'active',
          },
          {id: 'execute', label: 'Solve', status: 'pending'},
        ]
      : [
          {
            id: 'configure',
            label: 'Configuration',
            status: isInvalid ? 'warning' : 'active',
          },
          {id: 'review', label: 'Review', status: 'pending'},
          {id: 'execute', label: 'Solve', status: 'pending'},
        ];
  const status = isMonitoring
    ? {label: 'Running', message: 'Running. 18 of 25 boundary passes solved.', tone: 'warning'}
    : isReviewed
      ? {label: 'Reviewed', message: 'Review accepted. Run operation is ready.', tone: 'success'}
      : isValidated
        ? {label: 'Ready for review', message: 'Configuration valid. Ready for review.', tone: 'neutral'}
      : isInvalid
        ? {label: 'Needs input', message: 'Enter an operation name before review.', tone: 'danger'}
        : {label: 'Configuration', message: 'Enter an operation name, then validate the configuration.', tone: 'neutral'};

  const validateConfiguration = () => {
    const nameControl = configurationForm.current?.elements.namedItem('operation-name');
    const nextOperationName = nameControl?.value.trim() ?? '';
    if (!nextOperationName) {
      setOperationState('invalid');
      return;
    }
    setOperationName(nextOperationName);
    setOperationState('validated');
  };

  return React.createElement(
    'section',
    {'data-packed-operation-state': operationState},
    React.createElement(
      Stack,
      {gap: 'regular'},
      React.createElement(PageHeader, {
        actions: React.createElement(
          Button,
          {
            isDisabled: !isReviewed,
            onPress: () => setOperationState('monitoring'),
            variant: 'primary',
          },
          'Run operation',
        ),
        description: 'Consumer-owned configuration, review, execution, and monitoring proof.',
        identity: 'RUN 0284',
        status: status.label,
        statusTone: status.tone,
        title: operationName || 'Untitled thermal solve',
      }),
      React.createElement(
        'form',
        {id: 'packed-operation-form', ref: configurationForm},
        React.createElement(
          FormSection,
          {title: 'Operation configuration'},
          React.createElement(
            FieldGroup,
            {legend: 'Required inputs'},
            React.createElement(TextField, {
              defaultValue: '',
              errorMessage: 'Enter an operation name before review.',
              isInvalid,
              isRequired: true,
              label: 'Operation name',
              name: 'operation-name',
            }),
            React.createElement(RadioGroup, {
              defaultValue: 'balanced',
              label: 'Solve mode',
              name: 'operation-mode',
              options: [
                {label: 'Conservative', value: 'conservative'},
                {label: 'Balanced', value: 'balanced'},
              ],
            }),
          ),
        ),
      ),
      React.createElement(
        ButtonGroup,
        {label: 'Operation review actions', orientation: 'vertical'},
        React.createElement(
          Button,
          {onPress: validateConfiguration, variant: 'secondary'},
          'Validate configuration',
        ),
        React.createElement(
          Dialog,
          {
            actions: ({close}) => React.createElement(
              Button,
              {
                onPress: () => {
                  setOperationState('reviewed');
                  close();
                },
                variant: 'primary',
              },
              'Accept review',
            ),
            closeLabel: 'Close operation review',
            description: 'Confirm the configured operation before execution.',
            title: 'Review operation',
            trigger: React.createElement(
              Button,
              {isDisabled: !isValidated},
              'Review configuration',
            ),
          },
          React.createElement(
            DescriptionList,
            {
              ariaLabel: 'Operation review details',
              emptyState: {description: 'Configure the operation first.', kind: 'no-data', title: 'No configuration'},
              items: [{description: operationName, id: 'name', term: 'Operation'}],
            },
          ),
        ),
      ),
      isInvalid
        ? React.createElement(
            InlineAlert,
            {title: 'Configuration incomplete', tone: 'danger'},
            'Add the required operation name before review.',
          )
        : null,
      React.createElement(ProcessTracker, {
        ariaLabel: 'Operation stages',
        stages,
        statusLabels: packedProcessStatusLabels,
      }),
      React.createElement(StatusIndicator, {
        announcement: 'polite',
        label: status.message,
        tone: status.tone,
      }),
      React.createElement(ProgressBar, {
        completionLabel: 'Complete when all 25 boundary passes are solved.',
        isActive: isMonitoring,
        label: isMonitoring ? 'Solving boundary passes' : 'Solve progress',
        maxValue: 25,
        minValue: 0,
        value: isMonitoring ? 18 : 0,
        valueLabel: isMonitoring ? '18 of 25 passes' : 'Not started',
      }),
    ),
  );
}
`;
}
