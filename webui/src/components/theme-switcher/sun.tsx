/********************************************************************************
 * Copyright (c) 2020 TypeFox and others
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 ********************************************************************************/

import * as React from "react";

function Icon(props: {height: number}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      height={props.height}
      style={{transform: 'scale(1.6)'}}
    >
      <path
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M256 48L256 96"
      ></path>
      <path
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M256 416L256 464"
      ></path>
      <path
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M403.08 108.92L369.14 142.86"
      ></path>
      <path
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M142.86 369.14L108.92 403.08"
      ></path>
      <path
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M464 256L416 256"
      ></path>
      <path
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M96 256L48 256"
      ></path>
      <path
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M403.08 403.08L369.14 369.14"
      ></path>
      <path
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
        d="M142.86 142.86L108.92 108.92"
      ></path>
      <circle
        cx="256"
        cy="256"
        r="80"
        fill="#ffcd56"
        stroke="#ffcd56"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
      ></circle>
    </svg>
  );
}

export default Icon;
