#!/usr/bin/env python

def savitzky_golay(y, window_size, order, deriv=0, rate=1):

    import numpy as np
    from math import factorial

    try:
        window_size = np.abs(np.int(window_size))
        order = np.abs(np.int(order))
    except ValueError, msg:
        raise ValueError("window_size and order have to be of type int")
    if window_size % 2 != 1 or window_size < 1:
        raise TypeError("window_size size must be a positive odd number")
    if window_size < order + 2:
        raise TypeError("window_size is too small for the polynomials order")
    order_range = range(order+1)
    half_window = (window_size -1) // 2
    # precompute coefficients
    b = np.mat([[k**i for i in order_range] for k in range(-half_window, half_window+1)])
    m = np.linalg.pinv(b).A[deriv] * rate**deriv * factorial(deriv)
    # pad the signal at the extremes with
    # values taken from the signal itself
    firstvals = y[0] - np.abs( y[1:half_window+1][::-1] - y[0] )
    lastvals = y[-1] + np.abs(y[-half_window-1:-1][::-1] - y[-1])
    y = np.concatenate((firstvals, y, lastvals))
    return np.convolve( m[::-1], y, mode='valid')


import histogram.hdf as hh, histogram as H, numpy as np, pylab
T2E =  0.0862

# dos = hh.load('dos-hist.h5')
from mccomponents.sample.phonon import doshist_fromidf
dos = doshist_fromidf('DOS')

def therm(E, T):
    t = 1./(np.exp(np.abs(E)/T/T2E)-1)
    t[E>0] += 1
    return t

E = np.arange(-60,60, 1.)
T = 300


E = np.hstack((-1. * dos.energy[::-1], dos.energy))
Z = np.hstack((dos.I[::-1], dos.I))
# pylab.plot(E, Z)

# extend E range
dE = dos.energy[1] - dos.energy[0]
Eprefix = np.arange(-60, E[0], dE)
Epostfix = np.arange(E[-1]+dE, 90, dE)
E = np.hstack((Eprefix, E, Epostfix))
Z = np.hstack((np.zeros(len(Eprefix)), Z, np.zeros(len(Epostfix))))
pylab.plot(E, Z)

IE = Z/np.abs(E)*therm(E, T)
bad = (IE!=IE) + np.isinf(IE)
nanindexes, = np.nonzero(bad)
if nanindexes.size:
    approx = (IE[nanindexes[0]-1] + IE[nanindexes[-1]+1])/2.
    IE[bad] = approx
pylab.plot(E, IE)
IE = savitzky_golay(IE, 17, 2)
pylab.plot(E, IE)
pylab.show()


C = 0.00701434948808
Q = np.arange(0, 15, 0.1)
IQ = Q*Q*np.exp(-C*Q*Q)
pylab.plot(Q, IQ)


IE1 = np.tile(IE, Q.size)
IQ1 = np.repeat(IQ, E.size)
IQE = IE1*IQ1
IQE.shape = Q.size, E.size

axes = [
    ('Q', Q, 'angstrom**-1'),
    ('E', E, 'meV'),
    ]
h = H.histogram('IQE', axes, data=IQE)
hh.dump(h, "modeled-IQE.h5")
