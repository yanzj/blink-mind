import { FocusMode, OpType } from '@blink-mind/core';
import { Flex, ZIndex } from '@blink-mind/renderer-react';
import { Button } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { OP_TYPE_SET_REFERENCE_TOPICS } from './utils';

const Root = styled(ZIndex)`
  position: absolute;
  left: calc(50% - 150px);
  top: 30px;
  width: 300px;
  background: white;
  padding: 10px;
  user-select: none;
`;

const Title = styled.div`
  margin-bottom: 10px;
`;

// const ButtonGroup = styled.div``;

export function AddReferenceTopicPanel(props) {
  const { zIndex, controller, model } = props;
  const onClickCancel = e => {
    controller.run('clearSelectedReferenceKeys', props);
    controller.run('enableOperation', props);
    controller.run('operation', {
      ...props,
      opType: OpType.FOCUS_TOPIC,
      focusKey: model.focusKey,
      focusMode: FocusMode.NORMAL
    });
  };
  const onClickConfirm = e => {
    const referenceKeys = controller.run('getSelectedReferenceKeys', props);
    controller.run('enableOperation', props);
    controller.run('operation', {
      ...props,
      opType: OP_TYPE_SET_REFERENCE_TOPICS,
      referenceKeys
    });
    controller.run('clearSelectedReferenceKeys', props);
  };
  return (
    <Root zIndex={zIndex}>
      <Title>
        Please select the topics you want to reference. After selection, click
        the confirm button.
      </Title>
      <Flex justifyContent={'space-around'}>
        <Button onClick={onClickConfirm}>Confirm</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </Flex>
    </Root>
  );
}