/* The copyright in this software is being made available under the BSD
 * License, included below. This software may be subject to other third party
 * and contributor rights, including patent rights, and no such rights are
 * granted under this license.  
 *
 * Copyright (c) 2010-2017, ITU/ISO/IEC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *  * Neither the name of the ITU/ISO/IEC nor the names of its contributors may
 *    be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

/** \file     CABAC_ContextModel.cpp
    \brief    context model class
*/

#include <algorithm>

#include "CABAC_ContextModel.h"
#include <assert.h>
#define min(X,Y) ((X) < (Y) ? (X) : (Y))  
#define max(X,Y) ((X) > (Y) ? (X) : (Y))  

using namespace std;

unsigned int CABAC_ContextModel::m_uiInstanceCounter = 0;

// ====================================================================================================================
// Public member functions
// ====================================================================================================================

CABAC_ContextModel::CABAC_ContextModel()
{
  // By default the context is initialized with equal probability
  init(1, 0);

  m_uiCtxIdx = m_uiInstanceCounter; // Which instance of this class is this?
  m_uiInstanceCounter++;
}

CABAC_ContextModel::~CABAC_ContextModel()
{
}

/**
 - initialize context model with respect to QP and initialization value
 .
 \param  qp         input QP value
 \param  initValue  8 bit initialization value
 */
void CABAC_ContextModel::init( unsigned int uiMps, unsigned int uiState )
{
	// HM init
	uiMps = min(max(0, uiMps), 51);
	int  slope = (uiState >> 4) * 5 - 45;
	int  offset = ((uiState & 15) << 3) - 16;
	m_ucInitState = min(max(1, (((slope * uiMps) >> 4) + offset)), 126);
	unsigned int mpState = (m_ucInitState >= 64);
	m_ucState = ((mpState ? (m_ucInitState - 64) : (63 - m_ucInitState)) << 1) + mpState;
	m_binsCoded = 0;
	
	// my init
	//m_ucState = (uiState << 1) + uiMps; // simple state setting
	//m_ucInitState = m_ucState;
	//m_binsCoded = 0;

#if RWTH_TRACE_CABAC_STATES
	for (unsigned int iState = 0; iState < RWTH_TRACE_CABAC_STATES_NUM_STATES; iState++)
	{
		m_uiTraceCabacState[iState] = 0;
	}
	m_uiTraceCabacTransitions.resize(RWTH_TRACE_CABAC_STATES_NUM_STATES);
	for (int i = 0; i < RWTH_TRACE_CABAC_STATES_NUM_STATES; i++)
	{
		//Grow Columns by n
		m_uiTraceCabacTransitions[i].resize(RWTH_TRACE_CABAC_STATES_NUM_STATES);
	}
	for (int i = 0; i < RWTH_TRACE_CABAC_STATES_NUM_STATES; i++)
	{
		for (int j = 0; j < RWTH_TRACE_CABAC_STATES_NUM_STATES; j++)
		{
			m_uiTraceCabacTransitions[i][j] = 0;
		}
	}
#endif
}

#if RWTH_TRACE_CABAC_STATES
void CABAC_ContextModel::updateTraceState()
{
  unsigned int uiMps = m_ucState & 1;
  unsigned int uiState = m_ucState >> 1;
  int uiTraceState = (uiMps == 0) ? 63-uiState : uiState + 64;
  m_uiTraceCabacState[uiTraceState]++;
}
#endif

void CABAC_ContextModel::updateLPS()
{
#if RWTH_TRACE_CABAC_STATES
  updateTraceState();
#endif
  m_ucState = m_aucNextStateLPS[ m_ucState ];
  m_binsCoded++;
}

void CABAC_ContextModel::updateMPS ()
{
#if RWTH_TRACE_CABAC_STATES
  updateTraceState();
#endif
  m_ucState = m_aucNextStateMPS[ m_ucState ];
  m_binsCoded++;
}

#if RWTH_TRACE_CABAC_STATES
void CABAC_ContextModel::addCabacStep(uint8_t cbin, uint8_t state_p, uint8_t mps_p, uint8_t state_a, uint8_t mps_a)
{
  uint8_t uiTraceStatePrev = (mps_p == 0) ? 63 - state_p : state_p + 64;
  uint8_t uiTraceStateAct  =  (mps_a == 0) ? 63 - state_a : state_a + 64;

  CABACStep tmp(cbin, uiTraceStatePrev, mps_p, uiTraceStateAct, mps_a);
  m_uiTraceCabacTransitions[uiTraceStatePrev][uiTraceStateAct]++;
  m_CABACSteps.push_back(tmp);
}
#endif
const unsigned char CABAC_ContextModel::m_aucNextStateMPS[ 128 ] =
{
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
  34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
  66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
  82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
  98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
  114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 124, 125, 126, 127
};

const unsigned char CABAC_ContextModel::m_aucNextStateLPS[ 128 ] =
{
  1, 0, 0, 1, 2, 3, 4, 5, 4, 5, 8, 9, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18, 19, 18, 19, 22, 23, 22, 23, 24, 25,
  26, 27, 26, 27, 30, 31, 30, 31, 32, 33, 32, 33, 36, 37, 36, 37,
  38, 39, 38, 39, 42, 43, 42, 43, 44, 45, 44, 45, 46, 47, 48, 49,
  48, 49, 50, 51, 52, 53, 52, 53, 54, 55, 54, 55, 56, 57, 58, 59,
  58, 59, 60, 61, 60, 61, 60, 61, 62, 63, 64, 65, 64, 65, 66, 67,
  66, 67, 66, 67, 68, 69, 68, 69, 70, 71, 70, 71, 70, 71, 72, 73,
  72, 73, 72, 73, 74, 75, 74, 75, 74, 75, 76, 77, 76, 77, 126, 127
};

const int CABAC_ContextModel::m_entropyBits[128] =
{
  0x08000, 0x08000, 0x076da, 0x089a0, 0x06e92, 0x09340, 0x0670a, 0x09cdf, 0x06029, 0x0a67f, 0x059dd, 0x0b01f, 0x05413, 0x0b9bf, 0x04ebf, 0x0c35f,
  0x049d3, 0x0ccff, 0x04546, 0x0d69e, 0x0410d, 0x0e03e, 0x03d22, 0x0e9de, 0x0397d, 0x0f37e, 0x03619, 0x0fd1e, 0x032ee, 0x106be, 0x02ffa, 0x1105d,
  0x02d37, 0x119fd, 0x02aa2, 0x1239d, 0x02836, 0x12d3d, 0x025f2, 0x136dd, 0x023d1, 0x1407c, 0x021d2, 0x14a1c, 0x01ff2, 0x153bc, 0x01e2f, 0x15d5c,
  0x01c87, 0x166fc, 0x01af7, 0x1709b, 0x0197f, 0x17a3b, 0x0181d, 0x183db, 0x016d0, 0x18d7b, 0x01595, 0x1971b, 0x0146c, 0x1a0bb, 0x01354, 0x1aa5a,
  0x0124c, 0x1b3fa, 0x01153, 0x1bd9a, 0x01067, 0x1c73a, 0x00f89, 0x1d0da, 0x00eb7, 0x1da79, 0x00df0, 0x1e419, 0x00d34, 0x1edb9, 0x00c82, 0x1f759,
  0x00bda, 0x200f9, 0x00b3c, 0x20a99, 0x00aa5, 0x21438, 0x00a17, 0x21dd8, 0x00990, 0x22778, 0x00911, 0x23118, 0x00898, 0x23ab8, 0x00826, 0x24458,
  0x007ba, 0x24df7, 0x00753, 0x25797, 0x006f2, 0x26137, 0x00696, 0x26ad7, 0x0063f, 0x27477, 0x005ed, 0x27e17, 0x0059f, 0x287b6, 0x00554, 0x29156,
  0x0050e, 0x29af6, 0x004cc, 0x2a497, 0x0048d, 0x2ae35, 0x00451, 0x2b7d6, 0x00418, 0x2c176, 0x003e2, 0x2cb15, 0x003af, 0x2d4b5, 0x0037f, 0x2de55
};
//! \}

#if RWTH_TRACE_CABAC_STATES && RWTH_TRACE_CABAC_TO_FILE
void CABAC_ContextModel::traceStatesToFile(FILE *poutFile)
{
  // don't trace empty contexts
    bool bCtxEmpty = true;
    for (unsigned int uiState = 0; uiState < RWTH_TRACE_CABAC_STATES_NUM_STATES; uiState++)
    {
      if (m_uiTraceCabacState[uiState] != 0)
      {
        bCtxEmpty = false;
        break;
      }
    }
    if (!bCtxEmpty)
    {
      fprintf(poutFile, "ctxIdInternal, %i", m_uiCtxIdx);
      for (unsigned int uiState = 0; uiState < RWTH_TRACE_CABAC_STATES_NUM_STATES; uiState++)  
      {
        fprintf(poutFile, ", %llu", m_uiTraceCabacState[uiState]);
      }
      fprintf(poutFile, "\n");
    }
}
#endif
