import type {ReactElement} from 'react';

import {announcementProps, ToneGlyph} from './feedback-support.js';
import type {AlertBannerProps, InlineAlertProps, StatusTone} from './feedback-types.js';

interface AlertFrameProps {
  readonly announcement: NonNullable<InlineAlertProps['announcement']>;
  readonly children: InlineAlertProps['children'];
  readonly kind: 'banner' | 'inline';
  readonly title: string;
  readonly tone: StatusTone;
}

function AlertFrame({announcement, children, kind, title, tone}: AlertFrameProps): ReactElement {
  const liveProps = announcementProps(announcement);
  return (
    <div
      {...(announcement === 'off' ? {role: 'note' as const} : liveProps)}
      data-kind={kind}
      data-tone={tone}
      data-wcl-alert=""
      {...(kind === 'banner' ? {'data-wcl-alert-banner': ''} : {'data-wcl-inline-alert': ''})}
    >
      <ToneGlyph tone={tone} />
      <div data-wcl-alert-copy="">
        <strong data-wcl-alert-title="">{title}</strong>
        {children === undefined || children === null ? null : (
          <div data-wcl-alert-description="">{children}</div>
        )}
      </div>
    </div>
  );
}

export function InlineAlert({
  announcement = 'off',
  children,
  title,
  tone,
}: InlineAlertProps): ReactElement {
  return (
    <AlertFrame announcement={announcement} kind="inline" title={title} tone={tone}>
      {children}
    </AlertFrame>
  );
}

export function AlertBanner({
  announcement = 'off',
  children,
  title,
  tone,
}: AlertBannerProps): ReactElement {
  return (
    <AlertFrame announcement={announcement} kind="banner" title={title} tone={tone}>
      {children}
    </AlertFrame>
  );
}
