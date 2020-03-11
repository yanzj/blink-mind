import { BlockType, FocusMode, OpType, DescBlockData } from '@blink-mind/core';
import { Drawer } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { getI18nText, I18nKey, Icon, stopPropagation } from '../../utils';
import { useRef } from 'react';
import { ITopicDescEditor } from '../../types';
const DescEditorWrapper = styled.div`
  overflow: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: auto;
`;

export function renderDrawer(props) {
  const { controller, model, topicKey } = props;
  const descEditorRef = useRef<ITopicDescEditor>();
  if (model.focusMode === FocusMode.EDITING_DESC) {
    const onDescEditorClose = e => {
      e.stopPropagation();
      const descData = model.getTopic(topicKey).getBlock(BlockType.DESC).block
        .data;
      controller.run('operation', {
        ...props,
        opType: OpType.SET_TOPIC_BLOCK,
        topicKey,
        blockType: BlockType.DESC,
        data: descData.set('data', descEditorRef.current.getContent()),
        focusMode: FocusMode.NORMAL
      });
    };

    const descEditor = controller.run('renderTopicDescEditor', {
      ...props,
      ref: descEditorRef
    });
    return (
      <Drawer
        key="drawer"
        title={getI18nText(props, I18nKey.EDIT_NOTES)}
        icon={Icon('note')}
        isOpen
        hasBackdrop
        backdropProps={{ onMouseDown: stopPropagation }}
        isCloseButtonShown={false}
        onClose={onDescEditorClose}
        size="70%"
      >
        <DescEditorWrapper>{descEditor}</DescEditorWrapper>
      </Drawer>
    );
  }
}
