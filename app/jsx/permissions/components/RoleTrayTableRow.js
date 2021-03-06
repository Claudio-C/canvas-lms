/*
 * Copyright (C) 2018 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import I18n from 'i18n!permissions_role_tray_table_row'
import {bool, func, node, oneOfType, string} from 'prop-types'
import React from 'react'
import {Button} from '@instructure/ui-buttons'
import {View, Flex} from '@instructure/ui-layout'
import {IconArrowOpenStartSolid} from '@instructure/ui-icons'
import {Text} from '@instructure/ui-elements'
import {ConnectedPermissionButton} from './PermissionButton'
import {ScreenReaderContent} from '@instructure/ui-a11y'
import {Checkbox} from '@instructure/ui-checkbox'
import permissionPropTypes, {ENABLED_FOR_NONE} from '../propTypes'

// TODO Pass in props needed to actually generate the button sara is working on
// TODO add expandable-ness to this. Will probably need to make this not a
//      stateless component at that point in time
export default function RoleTrayTableRow({
  description,
  expandable,
  title,
  permission,
  permissionName,
  permissionLabel,
  onChange,
  role,
  permButton: PermButton
}) {
  const isGranular = typeof permission.group !== 'undefined'
  let button

  function toggle() {
    const id = role.id
    const enabled = !permission.enabled
    const name = permissionName

    onChange({enabled, explicit: true, id, name})
  }

  if (isGranular) {
    button = (
      <Checkbox
        checked={permission.enabled !== ENABLED_FOR_NONE}
        disabled={permission.readonly}
        label={<ScreenReaderContent>{permissionLabel}</ScreenReaderContent>}
        value={permissionName}
        onChange={toggle}
      />
    )
  } else {
    button = (
      <PermButton
        permission={permission}
        permissionName={permissionName}
        permissionLabel={permissionLabel}
        roleId={role.id}
        roleLabel={role.label}
        inTray
      />
    )
  }

  return (
    <View as="div">
      <Flex justifyItems="space-between">
        <Flex.Item>
          {expandable && (
            <span className="ic-permissions_role_tray_table_role_expandable">
              <Button variant="icon" size="small">
                <IconArrowOpenStartSolid title={I18n.t('Expand permission')} />
              </Button>
            </span>
          )}

          <Flex direction="column" width="12em" margin={expandable ? '0' : '0 0 0 medium'} inline>
            <Flex.Item>
              <Text weight="bold" lineHeight="fit" size="small">
                {title}
              </Text>
            </Flex.Item>
            <Flex.Item>
              {description && (
                <Text lineHeight="fit" size="small">
                  {description}
                </Text>
              )}
            </Flex.Item>
          </Flex>
        </Flex.Item>

        <Flex.Item>
          <div className="ic-permissions__cell-content">{button}</div>
        </Flex.Item>
      </Flex>
    </View>
  )
}

RoleTrayTableRow.propTypes = {
  description: string,
  expandable: bool,
  permission: permissionPropTypes.rolePermission.isRequired,
  permissionName: string.isRequired,
  permissionLabel: string.isRequired,
  role: permissionPropTypes.role.isRequired,
  onChange: func,
  title: string.isRequired,
  permButton: oneOfType([node, func]) // used for tests only
}

RoleTrayTableRow.defaultProps = {
  description: '',
  onChange: Function.prototype,
  expandable: false,
  permButton: ConnectedPermissionButton
}
